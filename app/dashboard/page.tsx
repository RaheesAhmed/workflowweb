'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useN8n } from '@/hooks/useN8n'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConnectionSetup } from '@/components/ConnectionSetup'
import { WorkflowList } from '@/components/WorkflowList'
import { WorkflowGrid } from '@/components/WorkflowGrid'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Zap,
  Mic,
  FileText,
  History,
  Settings,
  Plus,
  Sparkles,
  Clock,
  CheckCircle,
  Loader2,
  Database,
  AlertCircle,
  Grid3X3,
  List,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Activity,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Users,
  Calendar,
  ExternalLink,
  Globe,
  Shield,
  ChevronDown,
  Eye,
  Edit,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Bell,
  Star,
  Workflow,
  Target,
  Layers,
  MousePointer,
  Headphones
} from 'lucide-react'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const { 
    activeConnection, 
    workflows, 
    loading: n8nLoading, 
    initialized, 
    loadWorkflows,
    activateWorkflow,
    deactivateWorkflow,
    deleteWorkflow
  } = useN8n()
  const router = useRouter()
  const [showConnectionSetup, setShowConnectionSetup] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  // Show connection setup when user is authenticated but has no n8n connection
  useEffect(() => {
    if (user && initialized && !activeConnection && !n8nLoading) {
      setShowConnectionSetup(true)
    }
  }, [user, initialized, activeConnection, n8nLoading])

  const handleConnectionSuccess = () => {
    setShowConnectionSetup(false)
  }

  const handleConnectionSkip = () => {
    setShowConnectionSetup(false)
  }

  const handleWorkflowAction = async (workflowId: string, action: 'activate' | 'deactivate' | 'delete' | 'edit' | 'view') => {
    try {
      switch (action) {
        case 'activate':
          await activateWorkflow(workflowId)
          break
        case 'deactivate':
          await deactivateWorkflow(workflowId)
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this workflow?')) {
            await deleteWorkflow(workflowId)
          }
          break
        case 'edit':
          if (activeConnection?.base_url) {
            window.open(`${activeConnection.base_url}/workflow/${workflowId}`, '_blank')
          }
          break
        case 'view':
          // Navigate to workflow details or analytics
          console.log('View workflow:', workflowId)
          break
      }
    } catch (error) {
      console.error('Workflow action failed:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadWorkflows(true)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         workflow.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && workflow.active) || 
                         (statusFilter === 'inactive' && !workflow.active)
    return matchesSearch && matchesStatus
  })

  const getStats = () => {
    const total = workflows.length
    const active = workflows.filter(w => w.active).length
    const inactive = total - active
    const successRate = total > 0 ? ((active / total) * 100).toFixed(1) : '0'
    
    return { total, active, inactive, successRate }
  }

  const stats = getStats()

  if (authLoading || !initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Premium Dashboard Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-50">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{getUserDisplayName()}</span>
                  </h1>
                  <p className="text-slate-400">Manage and monitor your automation workflows</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              
              
              {/* Settings Button */}
              <Button
                variant="outline"
                onClick={() => setShowConnectionSetup(true)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 px-4 py-3 h-auto"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Connection Status Banner */}
        {!activeConnection && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/30 rounded-3xl p-6 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-500">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-300 mb-2">n8n Connection Required</h3>
                    <p className="text-amber-200/80 mb-4">
                      Connect your n8n instance to start creating voice-powered workflows. This enables WorkFlow AI to deploy automations directly to your n8n environment.
                    </p>
                    <Button 
                      onClick={() => setShowConnectionSetup(true)}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Connect n8n Instance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Premium Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-0 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-medium">Total Workflows</p>
                  <p className="text-3xl font-bold text-slate-50 group-hover:text-indigo-100 transition-colors duration-300">{stats.total}</p>
                  <p className="text-xs text-indigo-400 font-medium">
                    {activeConnection ? 'Ready to automate' : 'Connect n8n to start'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-0 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-medium">Active Workflows</p>
                  <p className="text-3xl font-bold text-slate-50 group-hover:text-emerald-100 transition-colors duration-300">{stats.active}</p>
                  <p className="text-xs text-emerald-400 font-medium">
                    Running automation
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-amber-500/40 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-0 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-medium">Inactive Workflows</p>
                  <p className="text-3xl font-bold text-slate-50 group-hover:text-amber-100 transition-colors duration-300">{stats.inactive}</p>
                  <p className="text-xs text-amber-400 font-medium">
                    Ready to deploy
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PauseCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-purple-500/40 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-0 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1 font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-slate-50 group-hover:text-purple-100 transition-colors duration-300">{stats.successRate}%</p>
                  <p className="text-xs text-purple-400 font-medium">
                    Performance metric
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Workflow Management Section */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-2xl overflow-hidden shadow-2xl">
          {/* Advanced Toolbar */}
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm border-b border-slate-700/30 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-50">Workflow Management</h2>
                    <p className="text-sm text-slate-400">
                      {filteredWorkflows.length} of {workflows.length} workflows
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-50 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 w-64"
                  />
                </div>
                
                {/* Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="appearance-none bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2 text-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 pr-8"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center bg-slate-900/50 border border-slate-600 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-indigo-500 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-indigo-500 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Refresh Button */}
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing || !activeConnection}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Workflows Display */}
          <div className="p-6">
            {n8nLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mx-auto mb-4" />
                  <p className="text-slate-400">Loading workflows...</p>
                </div>
              </div>
            ) : !activeConnection ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
                  <Database className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">Connect n8n Instance</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  Connect your n8n instance to view and manage your workflows from here.
                </p>
                <Button 
                  onClick={() => setShowConnectionSetup(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Connect n8n Instance
                </Button>
              </div>
            ) : filteredWorkflows.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
                  <Workflow className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-50 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No workflows match your filters' : 'No workflows found'}
                </h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Create your first workflow with voice commands or import from n8n.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    disabled={!activeConnection}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Create First Workflow
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {viewMode === 'grid' ? (
                  <WorkflowGrid 
                    workflows={filteredWorkflows} 
                    onAction={handleWorkflowAction}
                    baseUrl={activeConnection?.base_url}
                  />
                ) : (
                  <WorkflowList 
                    workflows={filteredWorkflows} 
                    onAction={handleWorkflowAction}
                    baseUrl={activeConnection?.base_url}
                  />
                )}
              </div>
            )}
          </div>
        </Card>

        
      </div>

      <Footer />
    </div>
  )
} 