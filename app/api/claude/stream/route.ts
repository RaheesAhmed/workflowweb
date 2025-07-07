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

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, config = {} } = body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Initialize Claude client
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const {
      model = 'claude-sonnet-4-20250514',
      max_tokens = 4096,
      temperature = 0.7,
      web_search_config
    } = config;

    // Build tools array - include web search if configured
    const tools: any[] = [];
    
    if (web_search_config) {
      const webSearchTool: any = {
        type: 'web_search_20250305',
        name: 'web_search'
      };

      if (web_search_config.max_uses) {
        webSearchTool.max_uses = web_search_config.max_uses;
      }
      if (web_search_config.allowed_domains) {
        webSearchTool.allowed_domains = web_search_config.allowed_domains;
      }
      if (web_search_config.blocked_domains) {
        webSearchTool.blocked_domains = web_search_config.blocked_domains;
      }

      tools.push(webSearchTool);
    }

    // Prepare messages with system prompt
    const formattedMessages = [
      {
        role: 'user' as const,
        content: SYSTEM_PROMPT
      },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    // Create streaming request directly
    const stream = await client.messages.stream({
      model,
      max_tokens,
      temperature,
      messages: formattedMessages,
      tools: tools.length > 0 ? tools : undefined,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send message start event
          const messageStartChunk = `data: ${JSON.stringify({
            type: 'message_start',
            data: { message: { id: `msg_${Date.now()}`, model, usage: {} } }
          })}\n\n`;
          controller.enqueue(encoder.encode(messageStartChunk));

          // Send content block start event  
          const contentBlockStartChunk = `data: ${JSON.stringify({
            type: 'content_block_start',
            data: { index: 0, content_block: { type: 'text', text: '' } }
          })}\n\n`;
          controller.enqueue(encoder.encode(contentBlockStartChunk));

          // Handle text streaming
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

          // Handle stream completion
          stream.on('end', () => {
            // Send content block stop event
            const contentBlockStopChunk = `data: ${JSON.stringify({
              type: 'content_block_stop',
              data: { index: 0 }
            })}\n\n`;
            controller.enqueue(encoder.encode(contentBlockStopChunk));

            // Send message stop event
            const messageStopChunk = `data: ${JSON.stringify({
              type: 'message_stop',
              data: {}
            })}\n\n`;
            controller.enqueue(encoder.encode(messageStopChunk));
            
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

    // Return streaming response with appropriate headers
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });

  } catch (error) {
    console.error('Claude API error:', error);
    
    // Handle specific Anthropic API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 401 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('context window')) {
        return NextResponse.json(
          { error: 'Context window exceeded. Please reduce message length.' },
          { status: 413 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
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