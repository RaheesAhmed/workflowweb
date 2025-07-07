'use client'

import { useState, useRef, useEffect } from 'react'
import { useVoice } from '@/hooks/useVoice'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Logo } from '@/components/Logo'
import { Welcome } from './Welcome'
import { 
  Mic,
  MicOff,
  Send,
  Loader2,
  MessageSquare,
  Volume2,
  VolumeX,
  Copy,
  Download,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  StopCircle,
  Play,
  Search,
  ExternalLink
} from 'lucide-react'

interface Citation {
  type: 'web_search_result_location';
  url: string;
  title: string;
  cited_text: string;
}

interface WebSearchResult {
  type: 'web_search_result';
  url: string;
  title: string;
  page_age?: string;
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isVoice?: boolean
  audioUrl?: string
  workflowGenerated?: boolean
  workflowData?: any
  citations?: Citation[]
  searchResults?: WebSearchResult[]
  isStreaming?: boolean
}

interface ChatAreaProps {
  className?: string
  clearMessagesTrigger?: number
}

export function ChatArea({ className, clearMessagesTrigger }: ChatAreaProps) {
  const { user } = useAuth()
  const { isRecording, startRecording, stopRecording, isSupported } = useVoice()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Clear messages when clearMessagesTrigger changes
  useEffect(() => {
    if (clearMessagesTrigger && clearMessagesTrigger > 0) {
      setMessages([])
      setInputText('')
      setShowWelcome(true)
      setIsTyping(false)
      setCurrentStreamingId(null)
      // Abort any ongoing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [clearMessagesTrigger])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string, isVoice = false) => {
    if (!content.trim()) return

    // Hide welcome cards when user sends first message
    setShowWelcome(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      isVoice
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Create assistant message placeholder for streaming
    const assistantMessageId = (Date.now() + 1).toString()
    setCurrentStreamingId(assistantMessageId)
    
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      citations: [],
      searchResults: []
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      // Prepare messages for Claude API
      const claudeMessages = messages.concat([userMessage]).map(msg => ({
        role: msg.type,
        content: msg.content
      }))

      // Call Claude streaming API with web search enabled
      const response = await fetch('/api/claude/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: claudeMessages,
          config: {
            model: 'claude-opus-4-20250514',
            max_tokens: 4096,
            temperature: 0.7,
            web_search_config: {
              max_uses: 3,
              allowed_domains: ['n8n.io', 'docs.n8n.io', 'community.n8n.io', 'github.com']
            }
          }
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body reader available')
      }

      let fullContent = ''
      let citations: Citation[] = []
      let searchResults: WebSearchResult[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))
              
              switch (event.type) {
                case 'content_block_delta':
                  if (event.data.delta.type === 'text_delta') {
                    fullContent += event.data.delta.text
                    
                    // Update the streaming message
                    setMessages(prev => prev.map(msg => 
                      msg.id === assistantMessageId 
                        ? { ...msg, content: fullContent }
                        : msg
                    ))
                  }
                  break

                case 'content_block_start':
                  if (event.data.content_block.type === 'web_search_tool_result') {
                    // Extract search results
                    const results = event.data.content_block.content || []
                    searchResults = results.filter((r: any) => r.type === 'web_search_result')
                  }
                  break

                case 'message_delta':
                  // Check for citations in the delta
                  if (event.data.delta.content) {
                    event.data.delta.content.forEach((block: any) => {
                      if (block.citations) {
                        citations.push(...block.citations)
                      }
                    })
                  }
                  break

                case 'message_stop':
                  // Finalize the message
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { 
                          ...msg, 
                          content: fullContent,
                          isStreaming: false,
                          citations,
                          searchResults,
                          workflowGenerated: fullContent.toLowerCase().includes('workflow') || fullContent.toLowerCase().includes('n8n'),
                          workflowData: fullContent.toLowerCase().includes('workflow') ? {
                            name: "AI Generated Workflow",
                            nodes: Math.floor(Math.random() * 10) + 3,
                            triggers: Math.floor(Math.random() * 3) + 1,
                            description: "Workflow created based on your requirements"
                          } : undefined
                        }
                      : msg
                  ))
                  setIsTyping(false)
                  setCurrentStreamingId(null)
                  break

                case 'error':
                  console.error('Stream error:', event.data.error)
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isStreaming: false }
                      : msg
                  ))
                  setIsTyping(false)
                  setCurrentStreamingId(null)
                  break
              }
            } catch (e) {
              console.error('Parse error:', e)
            }
          }
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted')
        return
      }
      
      console.error('Claude API error:', error)
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'Sorry, I encountered an error connecting to the AI service. Please try again.', isStreaming: false }
          : msg
      ))
      setIsTyping(false)
      setCurrentStreamingId(null)
    } finally {
      abortControllerRef.current = null
    }
  }

  const handleSolutionSelect = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const transcription = await stopRecording()
      if (transcription) {
        handleSendMessage(transcription, true)
      }
    } else {
      await startRecording()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputText)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadWorkflow = (workflowData: any) => {
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowData.name.replace(/\s+/g, '_').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stopCurrentStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsTyping(false)
    setCurrentStreamingId(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages - Full Height */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4 scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Welcome Component - Show when no messages */}
        {showWelcome && (
          <Welcome onSelectSolution={handleSolutionSelect} />
        )}
        
        {messages.map((message) => (
          <div key={message.id} className="flex justify-start">
            <div className="max-w-[90%] md:max-w-[80%] w-full">
              <div className="flex items-start gap-2 md:gap-3">
                {/* Avatar */}
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                    : 'bg-transparent'
                }`}>
                  {message.type === 'user' ? (
                    <span className="text-white text-xs md:text-sm font-semibold">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  ) : (
                    <Logo size={typeof window !== 'undefined' && window.innerWidth < 768 ? 24 : 32} />
                  )}
                </div>
                
                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {message.isVoice && (
                      <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Voice
                      </Badge>
                    )}

                  </div>
                  
                  <p className="text-sm md:text-base text-slate-300 whitespace-pre-wrap leading-relaxed mb-2 md:mb-3">
                    {message.content}
                    {message.isStreaming && <span className="animate-pulse">▊</span>}
                  </p>

                  {/* Web Search Results */}
                  {message.searchResults && message.searchResults.length > 0 && (
                    <Card className="bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm mb-2 md:mb-3">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Search className="w-4 h-4 text-blue-400" />
                          <h4 className="font-semibold text-blue-300 text-sm">Web Search Results</h4>
                        </div>
                        <div className="space-y-2">
                          {message.searchResults.map((result, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-blue-500/5 rounded-lg">
                              <ExternalLink className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <a 
                                  href={result.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-300 hover:text-blue-200 text-sm font-medium line-clamp-1"
                                >
                                  {result.title}
                                </a>
                                {result.page_age && (
                                  <p className="text-xs text-slate-400">Updated: {result.page_age}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <Card className="bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm mb-2 md:mb-3">
                      <CardContent className="p-3 md:p-4">
                        <h4 className="font-semibold text-amber-300 text-sm mb-2">Sources</h4>
                        <div className="space-y-1">
                          {message.citations.map((citation, index) => (
                            <div key={index} className="text-xs text-slate-300">
                              <a 
                                href={citation.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-amber-300 hover:text-amber-200"
                              >
                                {citation.title}
                              </a>
                              {citation.cited_text && (
                                <p className="text-slate-400 mt-1 italic">"{citation.cited_text}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Workflow Generation Card */}
                  {message.workflowGenerated && message.workflowData && (
                    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 backdrop-blur-sm mb-2 md:mb-3">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-indigo-300 mb-1 text-sm md:text-base">Workflow Generated</h4>
                            <h5 className="text-base md:text-lg font-bold text-slate-200 mb-1 md:mb-2">{message.workflowData.name}</h5>
                            <p className="text-xs md:text-sm text-slate-400 mb-2 md:mb-3">{message.workflowData.description}</p>
                            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3 text-xs md:text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {message.workflowData.nodes} nodes
                              </span>
                              <span className="flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                {message.workflowData.triggers} triggers
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button size="sm" className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/20 text-xs md:text-sm">
                                <Play className="w-3 h-3 mr-1" />
                                Preview
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => downloadWorkflow(message.workflowData)}
                                className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/20 text-xs md:text-sm"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Message Actions */}
                  <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(message.content)}
                      className="h-6 md:h-8 px-1 md:px-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {message.type === 'assistant' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsSpeaking(!isSpeaking)}
                        className="h-6 md:h-8 px-1 md:px-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700/30"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </Button>
                    )}
                    {message.isStreaming && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={stopCurrentStream}
                        className="h-6 md:h-8 px-1 md:px-2 text-red-400 hover:text-red-300 hover:bg-red-700/30"
                      >
                        <StopCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Timestamp at Bottom */}
                  <div className="mt-1">
                    <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}


        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Sticky to Bottom */}
      <div className="flex-shrink-0 p-2 md:p-4 border-t border-slate-700/50">
        <div className="flex gap-2 md:gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the workflow you want to create..."
              className="min-h-[44px] md:min-h-[52px] max-h-32 resize-none bg-slate-800/50 border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-200 placeholder-slate-500 pr-10 md:pr-12 text-sm md:text-base"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              size="sm"
              className="absolute right-1 md:right-2 top-1 md:top-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed h-8 w-8 md:h-10 md:w-10 p-0"
            >
              {isTyping ? (
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
              ) : (
                <Send className="w-3 h-3 md:w-4 md:h-4" />
              )}
            </Button>
          </div>

          {/* Voice Button */}
          <div className="flex flex-col items-center justify-center">
            <Button
              onClick={handleVoiceRecording}
              disabled={!isSupported || isTyping}
              className={`w-11 h-11 md:w-14 md:h-14 rounded-full transition-all duration-300 ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 hover:scale-105'
              } shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRecording ? (
                <StopCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
              ) : (
                <Mic className="w-4 h-4 md:w-6 md:h-6 text-white" />
              )}
            </Button>
            {isRecording && (
              <div className="flex items-center gap-1 mt-1 md:mt-2">
                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400 font-medium">Recording</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 