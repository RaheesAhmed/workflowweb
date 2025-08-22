import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/utils/system_prompt';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ClaudeMessage[];
  config?: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
    web_search_config?: {
      max_uses?: number;
      allowed_domains?: string[];
      blocked_domains?: string[];
    };
  };
}



// Simple in-memory rate limiting (for production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userRequests.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userRequests.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse and validate request body
    let body: ChatRequest;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { messages, config = {} } = body;

    // Enhanced request validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    if (messages.length > 100) {
      return NextResponse.json(
        { error: 'Too many messages in conversation (max 100)' },
        { status: 400 }
      );
    }
    
    // Validate message structure
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: 'Each message must have role and content' },
          { status: 400 }
        );
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json(
          { error: 'Message role must be either "user" or "assistant"' },
          { status: 400 }
        );
      }
      if (typeof msg.content !== 'string' && !Array.isArray(msg.content)) {
        return NextResponse.json(
          { error: 'Message content must be string or array' },
          { status: 400 }
        );
      }
    }
    
    console.log(`Processing request from ${clientIP} with ${messages.length} messages`);
    
    // API key validation
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Initialize Claude client
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const {
      model = 'claude-sonnet-4-20250514',
      max_tokens = 64000,
      temperature = 0.7,
    } = config;

    // Format messages for Claude API - ensure all content is strings
    const formattedMessages = messages.map(msg => {
      // Handle different content types
      let content = msg.content;
      
      // If content is an array (tool use case), convert to string
      if (Array.isArray(content)) {
        // Extract text content from array
        const textContent = content
          .filter(block => block.type === 'text')
          .map(block => block.text)
          .join('\n');
        content = textContent || '';
      }
      
      // Ensure content is not empty
      if (!content || content.trim() === '') {
        content = '...'; // Placeholder for empty content
      }
      
      return {
        role: msg.role as 'user' | 'assistant',
        content: content
      };
    });

    // Configure web search tool with optional config
    const webSearchConfig = config.web_search_config || {};
    const webSearchTool = {
      type: "web_search_20250305" as const,
      name: "web_search" as const,
      max_uses: webSearchConfig.max_uses || 5,
      ...(webSearchConfig.allowed_domains && { allowed_domains: webSearchConfig.allowed_domains }),
      ...(webSearchConfig.blocked_domains && { blocked_domains: webSearchConfig.blocked_domains }),
    };

    // Create streaming response using Claude SDK
    const stream = await client.messages.stream({
      model,
      max_tokens,
      temperature,
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      tools: [webSearchTool],
    });

    // Create a readable stream for the response using proper Claude SDK streaming
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let isFirstChunk = true;
          
          // Send message start event
          const messageStart = `data: ${JSON.stringify({
            type: 'message_start',
            data: { message: { id: `msg_${Date.now()}`, model, usage: {} } }
          })}\n\n`;
          controller.enqueue(encoder.encode(messageStart));

          // Send initial content block start
          const contentBlockStart = `data: ${JSON.stringify({
            type: 'content_block_start',
            data: { index: 0, content_block: { type: 'text', text: '' } }
          })}\n\n`;
          controller.enqueue(encoder.encode(contentBlockStart));

          // Handle text streaming directly
          stream.on('text', (text) => {
            const chunk = `data: ${JSON.stringify({
              type: 'content_block_delta',
              data: {
                index: 0,
                delta: { type: 'text_delta', text: text }
              }
            })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          });

          // Handle message completion
          stream.on('finalMessage', (message) => {
            // Send content block stop
            const contentBlockStop = `data: ${JSON.stringify({
              type: 'content_block_stop',
              data: { index: 0 }
            })}\n\n`;
            controller.enqueue(encoder.encode(contentBlockStop));

            // Send message delta with usage info
            const messageDelta = `data: ${JSON.stringify({
              type: 'message_delta',
              data: { 
                delta: { 
                  stop_reason: message.stop_reason,
                  stop_sequence: message.stop_sequence 
                },
                usage: message.usage 
              }
            })}\n\n`;
            controller.enqueue(encoder.encode(messageDelta));

            // Send final message stop
            const messageStop = `data: ${JSON.stringify({
              type: 'message_stop',
              data: {}
            })}\n\n`;
            controller.enqueue(encoder.encode(messageStop));
            
            controller.close();
          });

          // Handle errors
          stream.on('error', (error) => {
            console.error('Claude stream error:', error);
            const chunk = `data: ${JSON.stringify({
              type: 'error',
              data: { error: error.message || 'Unknown error occurred' }
            })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
            controller.close();
          });

        } catch (error) {
          console.error('Stream setup error:', error);
          const chunk = `data: ${JSON.stringify({
            type: 'error',
            data: { error: error instanceof Error ? error.message : 'Stream setup failed' }
          })}\n\n`;
          controller.enqueue(encoder.encode(chunk));
          controller.close();
        }
      },

      cancel() {
        // Clean up resources if stream is cancelled
        try {
          stream.abort();
        } catch (error) {
          console.error('Error aborting stream:', error);
        }
      }
    });

    // Return streaming response with optimized headers
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error('Claude API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    // Handle specific Anthropic API errors with detailed logging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('Anthropic API key error - check configuration');
        return NextResponse.json(
          { error: 'AI service authentication error' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        console.warn('Anthropic API rate limit exceeded');
        return NextResponse.json(
          { error: 'AI service temporarily busy. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('context window') || error.message.includes('413')) {
        console.warn('Context window exceeded for request');
        return NextResponse.json(
          { error: 'Conversation too long. Please start a new conversation.' },
          { status: 413 }
        );
      }
      
      if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
        console.error('Network timeout or connection reset');
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 504 }
        );
      }
      
      if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
        console.error('Anthropic service error:', error.message);
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
    }

    // Log unknown errors for debugging
    console.error('Unexpected error in Claude API route:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`
    });

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
