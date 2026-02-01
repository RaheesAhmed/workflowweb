'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useN8n } from '@/hooks/useN8n'
import { useRouter } from 'next/navigation'
import { ChatArea } from '@/components/playground/ChatArea'
import { ChatHistory } from '@/components/playground/ChatHistory'
import { ConnectionSetup } from '@/components/ConnectionSetup'
import { Logo } from '@/components/Logo'
import { Loader2, AlertCircle, Database, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isWorkflowJson } from '@/utils/workflowDetector'

export default function AIPlayground() {
  const { user, loading: authLoading } = useAuth()
  const { activeConnection, loading: n8nLoading, initialized } = useN8n()
  const router = useRouter()
  const [showConnectionSetup, setShowConnectionSetup] = useState(false)
  const [hasShownConnectionPrompt, setHasShownConnectionPrompt] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clearMessagesTrigger, setClearMessagesTrigger] = useState(0)
  const [refreshSessionsTrigger, setRefreshSessionsTrigger] = useState(0)

  // Function to recalculate workflow count from messages
  const calculateWorkflowCount = (messages: any[]): number => {
    let workflowCount = 0
    messages.forEach(msg => {
      if (msg.type === 'assistant' && msg.content.includes('```json')) {
        const jsonBlocks = msg.content.match(/```json\n([\s\S]*?)\n```/g) || []
        jsonBlocks.forEach((block: string) => {
          const jsonContent = block.replace(/```json\n/, '').replace(/\n```$/, '')
          if (isWorkflowJson(jsonContent)) {
            workflowCount++
          }
        })
      }
    })
    return workflowCount
  }
  const [currentChatData, setCurrentChatData] = useState<{
    messages: any[];
    title?: string;
    messageCount: number;
    hasWorkflows: boolean;
    workflowCount: number;
    type: 'voice' | 'text' | 'mixed';
  }>({
    messages: [],
    messageCount: 0,
    hasWorkflows: false,
    workflowCount: 0,
    type: 'text'
  })

  // Debug: Log when currentChatData changes
  useEffect(() => {
    console.log('currentChatData updated in parent:', currentChatData)
  }, [currentChatData])
  const [loadChatData, setLoadChatData] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  // Show connection setup ONLY ONCE when user is authenticated but has no n8n connection
  useEffect(() => {
    // Only show automatically once, and not if already shown or currently loading
    if (user && initialized && !activeConnection && !n8nLoading && !hasShownConnectionPrompt) {
      // Mark that we've shown the prompt
      setHasShownConnectionPrompt(true)
      
      // Check if user has dismissed the prompt before (stored in localStorage)
      const hasUserDismissedBefore = localStorage.getItem('workflowai_connection_dismissed')
      
      // Only show if user hasn't dismissed it before
      if (!hasUserDismissedBefore) {
        setShowConnectionSetup(true)
      }
    }
  }, [user, initialized, activeConnection, n8nLoading, hasShownConnectionPrompt])

  const handleConnectionSuccess = () => {
    setShowConnectionSetup(false)
    // Clear the dismissed flag since they connected
    localStorage.removeItem('workflowai_connection_dismissed')
  }

  const handleConnectionSkip = () => {
    setShowConnectionSetup(false)
    // Remember that user dismissed the popup
    localStorage.setItem('workflowai_connection_dismissed', 'true')
  }
  
  const handleManualConnectionSetup = () => {
    // Manually triggered connection setup
    setShowConnectionSetup(true)
  }

  const handleClearMessages = () => {
    // Clear any loaded chat data for new chat
    setLoadChatData(null)
    setClearMessagesTrigger(prev => prev + 1)
  }

  const handleSelectChat = (chatId: string) => {
    console.log('Selecting chat:', chatId)
    
    // Load chat data from localStorage
    const savedSessions = localStorage.getItem('workflowai_chat_sessions')
    console.log('Saved sessions:', savedSessions)
    
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions)
        console.log('Parsed sessions:', sessions)
        const selectedSession = sessions.find((session: any) => session.id === chatId)
        console.log('Selected session:', selectedSession)
        
        if (selectedSession) {
          // Load the full chat data from localStorage
          const chatDataKey = `workflowai_chat_${chatId}`
          console.log('Looking for chat data key:', chatDataKey)
          const savedChatData = localStorage.getItem(chatDataKey)
          console.log('Saved chat data:', savedChatData)
          
          if (savedChatData) {
            const chatData = JSON.parse(savedChatData)
            console.log('Parsed chat data:', chatData)
            
            // Recalculate workflow count from actual messages (in case old sessions have wrong count)
            const messages = chatData.messages || []
            const actualWorkflowCount = calculateWorkflowCount(messages)
            const hasWorkflows = actualWorkflowCount > 0
            console.log('Recalculated workflow count:', actualWorkflowCount, 'hasWorkflows:', hasWorkflows)
            
            // Set the chat data to load
            const loadData = {
              messages: messages,
              title: selectedSession.title,
              messageCount: selectedSession.messageCount,
              hasWorkflows: hasWorkflows,
              workflowCount: actualWorkflowCount,
              type: selectedSession.type
            }
            console.log('Setting load data:', loadData)
            setLoadChatData(loadData)
            
            // Update the saved session with correct workflow count (for future loads)
            if (actualWorkflowCount !== selectedSession.workflowCount || hasWorkflows !== selectedSession.hasWorkflows) {
              const updatedSessions = sessions.map((session: any) => 
                session.id === chatId 
                  ? { ...session, hasWorkflows: hasWorkflows, workflowCount: actualWorkflowCount }
                  : session
              )
              localStorage.setItem('workflowai_chat_sessions', JSON.stringify(updatedSessions))
              
              // Trigger refresh of ChatHistory component to show updated workflow counts
              console.log('Triggering ChatHistory refresh to show updated workflow counts')
              setRefreshSessionsTrigger(prev => prev + 1)
            }
            
            // Increment clear trigger to load the new chat
            console.log('Incrementing clearMessagesTrigger')
            setClearMessagesTrigger(prev => {
              console.log('clearMessagesTrigger changing from', prev, 'to', prev + 1)
              return prev + 1
            })
          } else {
            console.log('No saved chat data found for key:', chatDataKey)
          }
        } else {
          console.log('No session found with ID:', chatId)
        }
      } catch (error) {
        console.error('Error loading chat:', error)
      }
    } else {
      console.log('No saved sessions found')
    }
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
    // On mobile, close the mobile menu when toggling
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false)
    }
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading AI Playground...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Show ConnectionSetup as overlay/popup
  if (showConnectionSetup) {
    return (
      <div className="fixed inset-0 z-50">
        <ConnectionSetup 
          onSuccess={handleConnectionSuccess}
          onSkip={handleConnectionSkip}
        />
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-900 overflow-hidden">
      <div className="relative h-full">
        {/* Mobile Header - Only visible on mobile */}
        <div className="md:hidden bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <h1 className="text-lg font-bold text-slate-200">WorkFlow AI</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMobileMenuToggle}
            className="text-slate-400 hover:text-slate-200 p-2"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Connection Warning Banner */}
        {!activeConnection && (
          <div className="absolute top-0 md:top-0 left-0 right-0 z-10 bg-amber-500/10 backdrop-blur-sm border-b border-amber-500/20 mt-14 md:mt-0">
            <div className="px-4 py-2">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-amber-200 text-sm flex-1">
                  Connect your n8n instance to access workflows and create automations.
                </p>
                <button
                  onClick={handleManualConnectionSetup}
                  className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Database className="w-3 h-3" />
                  <span className="hidden sm:inline">Connect</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className={`flex h-full ${!activeConnection ? 'pt-12 md:pt-12' : 'pt-14 md:pt-0'}`}>
          {/* Desktop Sidebar */}
          <div className={`hidden md:block ${
            sidebarCollapsed ? 'w-16' : 'w-80'
          } transition-all duration-300 border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden`}>
            <ChatHistory 
              collapsed={sidebarCollapsed} 
              onToggle={handleSidebarToggle}
              onClearMessages={handleClearMessages}
              currentChatData={currentChatData}
              onSelectChat={handleSelectChat}
              refreshTrigger={refreshSessionsTrigger}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Sidebar */}
              <div className="relative w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 overflow-hidden">
                <ChatHistory 
                  collapsed={false} 
                  onToggle={() => setMobileMenuOpen(false)}
                  onClearMessages={handleClearMessages}
                  currentChatData={currentChatData}
                  onSelectChat={handleSelectChat}
                  refreshTrigger={refreshSessionsTrigger}
                />
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex justify-center min-w-0">
            <div className="w-full max-w-4xl">
              <ChatArea 
                clearMessagesTrigger={clearMessagesTrigger} 
                onChatDataChange={setCurrentChatData}
                loadChatData={loadChatData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
