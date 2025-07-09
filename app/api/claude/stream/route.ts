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

// Production-ready tool execution with error handling and retries
async function executeWorkflowDatabaseSearch(input: any, retryCount = 0): Promise<string> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  
  try {
    console.log('Executing workflow database search:', input, `(attempt ${retryCount + 1})`);
    
    // Input validation
    if (!input || typeof input !== 'object') {
      return 'Invalid input provided for workflow database search';
    }
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const searchResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workflows/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!searchResponse.ok) {
      // Handle specific HTTP errors
      if (searchResponse.status === 429) {
        throw new Error('Rate limit exceeded for workflow search');
      }
      if (searchResponse.status === 500) {
        throw new Error('Internal server error in workflow search');
      }
      throw new Error(`Search API error: ${searchResponse.status} ${searchResponse.statusText}`);
    }
    
    const searchResults = await searchResponse.json();
    console.log('Search results:', searchResults);
    
    // Validate response structure
    if (!searchResults || !Array.isArray(searchResults.workflows)) {
      return 'Invalid response format from workflow database';
    }
    
    if (searchResults.workflows.length === 0) {
      return 'No workflows found in database matching your criteria. I\'ll create a new workflow based on best practices.';
    }
    
    const formattedResults = searchResults.workflows.map((workflow: any) => ({
      name: workflow.name || 'Unknown',
      description: workflow.description || 'No description',
      trigger_type: workflow.trigger_type || 'unknown',
      complexity: workflow.complexity || 'unknown',
      node_count: workflow.node_count || 0,
      integrations: workflow.integrations || [],
      created_at: workflow.created_at || 'unknown'
    }));
    
    return `Found ${formattedResults.length} workflows in the database:\n\n${JSON.stringify(formattedResults, null, 2)}\n\nNow please use these real workflow patterns and n8n node types to create the requested workflow.`;
    
  } catch (error) {
    console.error('Tool execution error:', error);
    
    // Retry logic for transient errors
    if (retryCount < MAX_RETRIES) {
      const isRetryableError = error instanceof Error && (
        error.message.includes('Rate limit') ||
        error.message.includes('timeout') ||
        error.message.includes('500') ||
        error.message.includes('502') ||
        error.message.includes('503') ||
        error.message.includes('504')
      );
      
      if (isRetryableError) {
        console.log(`Retrying workflow search after ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return executeWorkflowDatabaseSearch(input, retryCount + 1);
      }
    }
    
    // Return user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `Error searching workflow database: ${errorMessage}. I'll create a workflow based on general best practices instead.`;
  }
}

async function executeToolCall(toolCall: any): Promise<string> {
  try {
    console.log('Executing tool call:', toolCall.name, toolCall.input);
    
    switch (toolCall.name) {
      case 'workflow_database_search':
        return await executeWorkflowDatabaseSearch(toolCall.input);
      default:
        console.warn('Unknown tool requested:', toolCall.name);
        return `Unknown tool: ${toolCall.name}`;
    }
  } catch (error) {
    console.error('Tool call execution failed:', error);
    return `Error executing tool ${toolCall.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
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
      max_tokens = 4096,
      temperature = 0.7,
    } = config;

    // Format messages for Claude API - ensure all content is strings
    let formattedMessages = messages.map(msg => {
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

    // Tool execution loop
    let conversationContinues = true;
    let currentMessages = [...formattedMessages];
    
    while (conversationContinues) {
      // Call Claude API
      const response = await client.messages.create({
        model,
        max_tokens,
        temperature,
        system: SYSTEM_PROMPT,
        messages: currentMessages,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 5,
          },
          {
            name: 'workflow_database_search',
            description: 'Search existing workflows in the database to find patterns, real n8n node types, and proven integrations. Use this BEFORE creating workflows to see what node types actually work.',
            input_schema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search term for workflow name or description'
                },
                integration: {
                  type: 'string',
                  description: 'Filter by specific integration (e.g. "slack", "gmail", "notion", "airtable")'
                },
                trigger_type: {
                  type: 'string',
                  description: 'Filter by trigger type (e.g. "webhook", "schedule", "manual")'
                },
                complexity: {
                  type: 'string',
                  description: 'Filter by complexity level (e.g. "simple", "medium", "complex")'
                },
                min_nodes: {
                  type: 'number',
                  description: 'Minimum number of nodes in workflow'
                },
                max_nodes: {
                  type: 'number', 
                  description: 'Maximum number of nodes in workflow'
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 20)'
                }
              },
              required: []
            }
          }
        ],
      });

      // Check if Claude wants to use tools
      const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');
      
      if (toolUseBlocks.length > 0) {
        // Execute tools
        const toolResults = await Promise.all(
          toolUseBlocks.map(async (toolBlock: any) => {
            const result = await executeToolCall(toolBlock);
            return {
              type: 'tool_result',
              tool_use_id: toolBlock.id,
              content: result
            };
          })
        );

        // Add assistant message with tool use
        currentMessages.push({
          role: 'assistant',
          content: response.content.map(block => 
            block.type === 'text' ? block.text : `[${block.type}]`
          ).join('')
        });

        // Add tool results as user message
        currentMessages.push({
          role: 'user', 
          content: toolResults.map(result => 
            `Tool result: ${result.content}`
          ).join('\n\n')
        });

        // Continue the conversation
        continue;
      } else {
        // No tools needed, stream the final response
        conversationContinues = false;
        
        // Now stream the final response
        const stream = await client.messages.stream({
          model,
          max_tokens,
          temperature,
          system: SYSTEM_PROMPT,
          messages: currentMessages,
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
              max_uses: 5,
            },
            {
              name: 'workflow_database_search',
              description: 'Search existing workflows in the database to find patterns, real n8n node types, and proven integrations. Use this BEFORE creating workflows to see what node types actually work.',
              input_schema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search term for workflow name or description'
                  },
                  integration: {
                    type: 'string',
                    description: 'Filter by specific integration (e.g. "slack", "gmail", "notion", "airtable")'
                  },
                  trigger_type: {
                    type: 'string',
                    description: 'Filter by trigger type (e.g. "webhook", "schedule", "manual")'
                  },
                  complexity: {
                    type: 'string',
                    description: 'Filter by complexity level (e.g. "simple", "medium", "complex")'
                  },
                  min_nodes: {
                    type: 'number',
                    description: 'Minimum number of nodes in workflow'
                  },
                  max_nodes: {
                    type: 'number', 
                    description: 'Maximum number of nodes in workflow'
                  },
                  limit: {
                    type: 'number',
                    description: 'Maximum number of results to return (default: 20)'
                  }
                },
                required: []
              }
            }
          ],
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

              // Send initial content block start
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

              // Handle message completion
              stream.on('finalMessage', async (message) => {
                // Send content block stop for text content
                const contentBlockStopChunk = `data: ${JSON.stringify({
                  type: 'content_block_stop', 
                  data: { index: 0 }
                })}\n\n`;
                controller.enqueue(encoder.encode(contentBlockStopChunk));

                // Send message delta with stop reason
                const messageDeltaChunk = `data: ${JSON.stringify({
                  type: 'message_delta',
                  data: { 
                    delta: { 
                      stop_reason: message.stop_reason,
                      stop_sequence: message.stop_sequence 
                    },
                    usage: message.usage 
                  }
                })}\n\n`;
                controller.enqueue(encoder.encode(messageDeltaChunk));

                // Send message stop
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
      }
    }

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