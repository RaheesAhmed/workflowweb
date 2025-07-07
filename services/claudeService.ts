import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/utils/system_prompt';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface WebSearchToolConfig {
  max_uses?: number;
  allowed_domains?: string[];
  blocked_domains?: string[];
  user_location?: {
    type: 'approximate';
    city: string;
    region: string;
    country: string;
    timezone: string;
  };
}

export interface ClaudeStreamConfig {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  web_search_config?: WebSearchToolConfig;
}

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }
    
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Create a streaming response with optional web search capabilities
   */
  async createStreamingResponse(
    messages: ClaudeMessage[],
    config: ClaudeStreamConfig = {}
  ) {
    const {
      model = 'claude-sonnet-4-20250514',
      max_tokens = 64000,
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

      // Add optional configurations
      if (web_search_config.max_uses) {
        webSearchTool.max_uses = web_search_config.max_uses;
      }
      if (web_search_config.allowed_domains) {
        webSearchTool.allowed_domains = web_search_config.allowed_domains;
      }
      if (web_search_config.blocked_domains) {
        webSearchTool.blocked_domains = web_search_config.blocked_domains;
      }
      if (web_search_config.user_location) {
        webSearchTool.user_location = web_search_config.user_location;
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

    // Create streaming request
    const stream = await this.client.messages.stream({
      model,
      max_tokens,
      temperature,
      messages: formattedMessages,
      tools: tools.length > 0 ? tools : undefined,
    });

    return stream;
  }

  /**
   * Process streaming events and format for web response
   */
  static formatStreamEvent(eventType: string, data: any): string {
    const eventData = {
      type: eventType,
      data: data
    };
    
    return `data: ${JSON.stringify(eventData)}\n\n`;
  }

  /**
   * Extract text content from Claude's response content blocks
   */
  static extractTextFromContent(content: any[]): string {
    if (!Array.isArray(content)) return '';
    
    return content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');
  }

  /**
   * Extract citations from Claude's response content blocks
   */
  static extractCitationsFromContent(content: any[]): any[] {
    if (!Array.isArray(content)) return [];
    
    const citations: any[] = [];
    
    content.forEach(block => {
      if (block.type === 'text' && block.citations) {
        citations.push(...block.citations);
      }
    });
    
    return citations;
  }

  /**
   * Extract web search results from content blocks
   */
  static extractWebSearchResults(content: any[]): any[] {
    if (!Array.isArray(content)) return [];
    
    return content
      .filter(block => block.type === 'web_search_tool_result')
      .flatMap(block => block.content || []);
  }
} 