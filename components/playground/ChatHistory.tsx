'use client'

import { useState, useEffect } from 'react'
import { useN8n } from '@/hooks/useN8n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/Logo'
import { 
  Search,
  MessageSquare,
  Clock,
  Trash2,
  Star,
  MoreVertical,
  Plus,
  Calendar,
  Filter,
  Archive,
  Download,
  Share2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Volume2,
  FileText,
  Activity,
  Play,
  Pause,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Database,
  Workflow
} from 'lucide-react'

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  isStarred: boolean
  hasWorkflows: boolean
  workflowCount?: number
  type: 'voice' | 'text' | 'mixed'
}

interface N8nWorkflow {
  id: string
  name: string
  active: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  nodes: number
  triggerCount: number
  lastExecution?: string
  status?: 'success' | 'error' | 'running' | 'waiting'
}

interface ChatHistoryProps {
  collapsed?: boolean;
  onToggle?: () => void;
  onClearMessages?: () => void;
  currentChatData?: {
    messages: any[];
    title?: string;
    messageCount: number;
    hasWorkflows: boolean;
    workflowCount: number;
    type: 'voice' | 'text' | 'mixed';
  };
  onSelectChat?: (chatId: string) => void;
  refreshTrigger?: number;
}

export function ChatHistory({ collapsed = false, onToggle, onClearMessages, currentChatData, onSelectChat, refreshTrigger }: ChatHistoryProps) {
  const { activeConnection, workflows, loading: n8nLoading, loadWorkflows, activateWorkflow, deactivateWorkflow } = useN8n()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'chats' | 'workflows'>('chats')
  const [filterType, setFilterType] = useState<'all' | 'starred' | 'workflows'>('all')
  const [workflowFilter, setWorkflowFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Function to load sessions from localStorage
  const loadSessionsFromStorage = () => {
    const savedSessions = localStorage.getItem('workflowai_chat_sessions')
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions)
        // Convert timestamp strings back to Date objects
        const sessionsWithDates = parsed.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        }))
        setSessions(sessionsWithDates)
      } catch (error) {
        console.error('Error loading sessions from localStorage:', error)
        setSessions([])
      }
    }
  }

  // Load sessions from localStorage on component mount
  useEffect(() => {
    loadSessionsFromStorage()
  }, [])

  // Refresh sessions when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      console.log('ChatHistory: Refreshing sessions from localStorage due to refreshTrigger:', refreshTrigger)
      loadSessionsFromStorage()
    }
  }, [refreshTrigger])

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('workflowai_chat_sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'starred' && session.isStarred) ||
                         (filterType === 'workflows' && session.hasWorkflows)
    return matchesSearch && matchesFilter
  })

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = (workflow.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (workflow.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = workflowFilter === 'all' || 
                         (workflowFilter === 'active' && workflow.active) ||
                         (workflowFilter === 'inactive' && !workflow.active)
    return matchesSearch && matchesFilter
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadWorkflows(true)
    } finally {
      setRefreshing(false)
    }
  }

  const handleWorkflowAction = async (workflowId: string, action: 'activate' | 'deactivate') => {
    try {
      console.log(`${action} workflow:`, workflowId)
      if (action === 'activate') {
        await activateWorkflow(workflowId)
      } else {
        await deactivateWorkflow(workflowId)
      }
    } catch (error) {
      console.error('Workflow action failed:', error)
    }
  }

  const toggleStar = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, isStarred: !session.isStarred }
        : session
    ))
  }

  const deleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this chat session?')) {
      setSessions(prev => prev.filter(session => session.id !== sessionId))
    }
  }

  const createNewChat = () => {
    console.log('createNewChat called, currentChatData:', currentChatData)
    
    // Save current chat if it has any messages
    if (currentChatData && currentChatData.messages.length > 0) {
      console.log('Chat has messages, proceeding to save...')
      const lastMessage = currentChatData.messages[currentChatData.messages.length - 1]
      const title = currentChatData.title || 
                   (currentChatData.messages.length > 0 ? 
                    currentChatData.messages[0].content.slice(0, 50) + '...' : 
                    'New Chat')
      
      const sessionId = Date.now().toString()
      
      const newSession: ChatSession = {
        id: sessionId,
        title,
        lastMessage: lastMessage.content.slice(0, 100),
        timestamp: new Date(),
        messageCount: currentChatData.messageCount,
        isStarred: false,
        hasWorkflows: currentChatData.hasWorkflows,
        workflowCount: currentChatData.workflowCount || 0,
        type: currentChatData.type
      }
      
      // Save the session metadata
      setSessions(prev => [newSession, ...prev])
      
      // Save the complete chat data separately
      const chatDataKey = `workflowai_chat_${sessionId}`
      const chatDataToSave = {
        messages: currentChatData.messages,
        title,
        timestamp: new Date(),
        type: currentChatData.type
      }
      console.log('Saving chat data to localStorage:', chatDataKey, chatDataToSave)
      localStorage.setItem(chatDataKey, JSON.stringify(chatDataToSave))
    }
    
    // Clear messages to start new chat
    console.log('Calling onClearMessages')
    if (onClearMessages) {
      onClearMessages()
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDate = (dateInput: string | Date | any) => {
    try {
      if (!dateInput) return 'Unknown'
      
      let date: Date
      if (typeof dateInput === 'string') {
        date = new Date(dateInput)
      } else if (dateInput instanceof Date) {
        date = dateInput
      } else {
        return 'Unknown'
      }
      
      if (isNaN(date.getTime())) return 'Unknown'
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Unknown'
    }
  }

  const getNodeCount = (nodes: any): number => {
    if (Array.isArray(nodes)) return nodes.length
    if (typeof nodes === 'number') return nodes
    return 0
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <Volume2 className="w-3 h-3" />
      case 'text':
        return <MessageSquare className="w-3 h-3" />
      case 'mixed':
        return <Sparkles className="w-3 h-3" />
      default:
        return <MessageSquare className="w-3 h-3" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'voice':
        return 'text-indigo-400 bg-indigo-500/10'
      case 'text':
        return 'text-emerald-400 bg-emerald-500/10'
      case 'mixed':
        return 'text-purple-400 bg-purple-500/10'
      default:
        return 'text-slate-400 bg-slate-500/10'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-emerald-500 bg-emerald-500/10'
      case 'error':
        return 'text-red-500 bg-red-500/10'
      case 'running':
        return 'text-blue-500 bg-blue-500/10'
      case 'waiting':
        return 'text-amber-500 bg-amber-500/10'
      default:
        return 'text-slate-500 bg-slate-500/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3" />
      case 'error':
        return <AlertCircle className="w-3 h-3" />
      case 'running':
        return <Loader2 className="w-3 h-3 animate-spin" />
      case 'waiting':
        return <Clock className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  // Mini sidebar when collapsed
  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 md:py-6 ">
        {/* Logo Toggle Button - Make it MUCH more prominent */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={onToggle}
            className="p-0 hover:scale-105 transition-all duration-200 group"
            title="Expand sidebar"
          >
            <Logo 
              size={window.innerWidth < 768 ? 32 : 40} 
              className="drop-shadow-lg flex-shrink-0" 
            />
          </button>
        </div>

        {/* Simple Tab Indicators - Just dots */}
        <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={() => setActiveTab('chats')}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              activeTab === 'chats' 
                ? 'bg-indigo-500 scale-125' 
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            title="Chats"
          />
          <button
            onClick={() => setActiveTab('workflows')}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              activeTab === 'workflows' 
                ? 'bg-indigo-500 scale-125' 
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            title="Workflows"
          />
        </div>

        {/* Activity Indicator */}
        <div className="mt-auto">
          <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
            activeConnection ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
          }`} title={activeConnection ? 'Connected to n8n' : 'Not connected'} />
        </div>
      </div>
    )
  }

  // Full sidebar view (existing code)
  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="p-3 md:p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onToggle}
              className="p-1 md:p-2 hover:bg-slate-800/50 rounded-xl transition-all duration-200 group"
              title="Collapse sidebar"
            >
              <Logo 
                size={window.innerWidth < 768 ? 24 : 32} 
                className="drop-shadow-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0" 
              />
            </button>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            {activeTab === 'workflows' && (
              <Button
                onClick={handleRefresh}
                disabled={refreshing || !activeConnection}
                size="sm"
                variant="outline"
                className="border-slate-600 hover:bg-slate-700 text-slate-300 h-8 w-8 md:h-9 md:w-9 p-0"
              >
                {refreshing ? (
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                )}
              </Button>
            )}
            <Button
              onClick={createNewChat}
              size="sm"
              className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/20 h-8 w-8 md:h-9 md:w-9 p-0"
              title="Start new chat"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-1 mb-3 md:mb-4 bg-slate-800/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              activeTab === 'chats' 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Chats</span>
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
              activeTab === 'workflows' 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Workflow className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Workflows</span>
            {activeConnection && <Badge variant="secondary" className="bg-slate-600/50 text-slate-300 text-xs ml-1">{workflows.length}</Badge>}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3 md:mb-4">
          <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
          <Input
            placeholder={activeTab === 'chats' ? "Search chats..." : "Search workflows..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 md:pl-9 pr-3 md:pr-4 py-2 bg-slate-800/50 border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-200 placeholder-slate-500 text-sm md:text-base h-8 md:h-9"
          />
        </div>

        {/* Filters */}
        {activeTab === 'chats' ? (
          <div className="flex gap-1 md:gap-2">
            <Button
              onClick={() => setFilterType('all')}
              size="sm"
              variant={filterType === 'all' ? 'default' : 'outline'}
              className={`flex-shrink-0 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${filterType === 'all' ? 
                'bg-indigo-600 hover:bg-indigo-700 text-white' : 
                'border-slate-600 hover:bg-slate-700 text-slate-300'
              }`}
            >
              All
            </Button>
            <Button
              onClick={() => setFilterType('starred')}
              size="sm"
              variant={filterType === 'starred' ? 'default' : 'outline'}
              className={`flex-shrink-0 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${filterType === 'starred' ? 
                'bg-amber-600 hover:bg-amber-700 text-white' : 
                'border-slate-600 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Star className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Starred</span>
            </Button>
            <Button
              onClick={() => setFilterType('workflows')}
              size="sm"
              variant={filterType === 'workflows' ? 'default' : 'outline'}
              className={`flex-shrink-0 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${filterType === 'workflows' ? 
                'bg-emerald-600 hover:bg-emerald-700 text-white' : 
                'border-slate-600 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Zap className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">With Workflows</span>
            </Button>
          </div>
        ) : (
          <div className="flex gap-1 md:gap-2">
            <Button
              onClick={() => setWorkflowFilter('all')}
              size="sm"
              variant={workflowFilter === 'all' ? 'default' : 'outline'}
              className={`flex-shrink-0 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${workflowFilter === 'all' ? 
                'bg-indigo-600 hover:bg-indigo-700 text-white' : 
                'border-slate-600 hover:bg-slate-700 text-slate-300'
              }`}
            >
              All
            </Button>
            <Button
              onClick={() => setWorkflowFilter('active')}
              size="sm"
              variant={workflowFilter === 'active' ? 'default' : 'outline'}
              className={`flex-shrink-0 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${workflowFilter === 'active' ? 
                'bg-emerald-600 hover:bg-emerald-700 text-white' : 
                'border-slate-600 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Active
            </Button>
            <Button
              onClick={() => setWorkflowFilter('inactive')}
              size="sm"
              variant={workflowFilter === 'inactive' ? 'default' : 'outline'}
              className={`flex-shrink-0 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${workflowFilter === 'inactive' ? 
                'bg-red-600 hover:bg-red-700 text-white' : 
                'border-slate-600 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Inactive
            </Button>
          </div>
        )}
      </div>

      {/* Content - Hidden Scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {activeTab === 'chats' ? (
          // Chat Sessions
          filteredSessions.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4 md:p-6">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-slate-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-slate-300 mb-2">
                  {searchTerm ? 'No matching chats' : 'No chat history'}
                </h3>
                <p className="text-sm text-slate-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start a conversation to see your chat history'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2 md:p-4 space-y-2 md:space-y-3">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer" 
                      onClick={() => onSelectChat && onSelectChat(session.id)}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-200 truncate group-hover:text-indigo-200 transition-colors text-sm md:text-base">
                            {session.title}
                          </h3>
                          {session.isStarred && (
                            <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-current flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={`text-xs ${getTypeColor(session.type)}`}>
                            {getTypeIcon(session.type)}
                            <span className="ml-1 capitalize hidden sm:inline">{session.type}</span>
                          </Badge>
                          {session.hasWorkflows && (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">{session.workflowCount} workflow{session.workflowCount !== 1 ? 's' : ''}</span>
                              <span className="sm:hidden">{session.workflowCount}</span>
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs md:text-sm text-slate-400 truncate mb-2 leading-relaxed">
                          {session.lastMessage}
                        </p>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(session.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span className="hidden sm:inline">{session.messageCount} messages</span>
                            <span className="sm:hidden">{session.messageCount}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleStar(session.id)}
                          className="h-6 w-6 md:h-8 md:w-8 p-0 text-slate-400 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-3 h-3 md:w-4 md:h-4 ${session.isStarred ? 'fill-current text-amber-400' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                          className="h-6 w-6 md:h-8 md:w-8 p-0 text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          {expandedSession === session.id ? (
                            <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                          ) : (
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Actions */}
                    {expandedSession === session.id && (
                      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-700/50">
                        <div className="grid grid-cols-2 gap-1 md:gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectChat && onSelectChat(session.id);
                            }}
                            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/20 text-xs h-7 md:h-8"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Open</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/20 text-xs h-7 md:h-8"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Export</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border-purple-500/20 text-xs h-7 md:h-8"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Share</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteSession(session.id)}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/20 text-xs h-7 md:h-8"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          // Workflows
          !activeConnection ? (
            <div className="flex items-center justify-center h-full p-4 md:p-6">
              <div className="text-center">
                <Database className="w-10 h-10 md:w-12 md:h-12 text-slate-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-slate-300 mb-2">No Connection</h3>
                <p className="text-sm text-slate-500">Connect your n8n instance to view workflows</p>
              </div>
            </div>
          ) : n8nLoading ? (
            <div className="p-2 md:p-4 space-y-3 md:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800/30 rounded-xl p-3 md:p-4 animate-pulse">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-3 md:h-4 bg-slate-700 rounded w-2/3"></div>
                    <div className="h-3 md:h-4 bg-slate-700 rounded w-12 md:w-16"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 md:h-3 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-2 md:h-3 bg-slate-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4 md:p-6">
              <div className="text-center">
                <Workflow className="w-10 h-10 md:w-12 md:h-12 text-slate-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-slate-300 mb-2">
                  {searchTerm ? 'No matching workflows' : 'No workflows found'}
                </h3>
                <p className="text-sm text-slate-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first workflow to get started'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2 md:p-4 space-y-2 md:space-y-3">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-200 truncate group-hover:text-indigo-200 transition-colors text-sm md:text-base">
                            {workflow.name || 'Untitled Workflow'}
                          </h3>
                          <Badge variant={workflow.active ? 'default' : 'secondary'} className={`text-xs ${
                            workflow.active ? 
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {workflow.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {workflow.tags?.map((tag, index) => (
                            <span key={`${workflow.id}-tag-${index}`} className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md">
                              {typeof tag === 'string' ? tag : 'Tag'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
                        className="text-slate-400 hover:text-slate-300 transition-colors p-1"
                      >
                        {expandedWorkflow === workflow.id ? (
                          <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs md:text-sm text-slate-400 mb-2">
                      <div className="flex items-center gap-3 md:gap-4">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {getNodeCount(workflow.nodes)} nodes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(workflow.updatedAt)}
                        </span>
                      </div>
                    </div>

                    {expandedWorkflow === workflow.id && (
                      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-700/50 space-y-2 md:space-y-3">
                        <div className="grid grid-cols-2 gap-1 md:gap-2">
                          <Button
                            onClick={() => handleWorkflowAction(workflow.id, workflow.active ? 'deactivate' : 'activate')}
                            size="sm"
                            className={`flex-1 text-xs h-7 md:h-8 ${
                              workflow.active
                                ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border-amber-500/20'
                                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {workflow.active ? (
                              <>
                                <Pause className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Activate</span>
                              </>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              if (activeConnection?.base_url) {
                                window.open(`${activeConnection.base_url}/workflow/${workflow.id}`, '_blank')
                              }
                            }}
                            className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/20 text-xs h-7 md:h-8"
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
} 