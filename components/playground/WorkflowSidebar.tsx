'use client'

import { useState, useEffect } from 'react'
import { useN8n } from '@/hooks/useN8n'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Zap,
  Play,
  Pause,
  Settings,
  Calendar,
  Activity,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  ChevronDown,
  ChevronRight,
  FileText,
  Database
} from 'lucide-react'

interface Workflow {
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

export function WorkflowSidebar() {
  const { activeConnection, loading } = useN8n()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    if (activeConnection) {
      // Simulate API call to fetch workflows
      const mockWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Slack Notification Bot',
          active: true,
          tags: ['slack', 'notifications'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          nodes: 5,
          triggerCount: 23,
          lastExecution: '2024-01-20T14:30:00Z',
          status: 'success'
        },
        {
          id: '2',
          name: 'Email Marketing Automation',
          active: true,
          tags: ['email', 'marketing'],
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-19T16:45:00Z',
          nodes: 8,
          triggerCount: 156,
          lastExecution: '2024-01-19T16:45:00Z',
          status: 'running'
        },
        {
          id: '3',
          name: 'Data Backup Scheduler',
          active: false,
          tags: ['backup', 'scheduled'],
          createdAt: '2024-01-05T11:20:00Z',
          updatedAt: '2024-01-15T08:15:00Z',
          nodes: 3,
          triggerCount: 45,
          lastExecution: '2024-01-15T08:15:00Z',
          status: 'error'
        },
        {
          id: '4',
          name: 'Customer Support Ticket Router',
          active: true,
          tags: ['support', 'tickets'],
          createdAt: '2024-01-12T13:45:00Z',
          updatedAt: '2024-01-18T11:20:00Z',
          nodes: 12,
          triggerCount: 89,
          lastExecution: '2024-01-18T11:20:00Z',
          status: 'waiting'
        },
        {
          id: '5',
          name: 'Social Media Content Sync',
          active: true,
          tags: ['social', 'content'],
          createdAt: '2024-01-08T15:30:00Z',
          updatedAt: '2024-01-17T09:10:00Z',
          nodes: 6,
          triggerCount: 34,
          lastExecution: '2024-01-17T09:10:00Z',
          status: 'success'
        }
      ]
      setWorkflows(mockWorkflows)
    }
  }, [activeConnection])

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && workflow.active) ||
                         (filterStatus === 'inactive' && !workflow.active)
    return matchesSearch && matchesFilter
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!activeConnection) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-200">n8n Workflows</h2>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No Connection</h3>
            <p className="text-sm text-slate-500">Connect your n8n instance to view workflows</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-200">n8n Workflows</h2>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="border-slate-600 hover:bg-slate-700 text-slate-300"
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-800/50 border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterStatus('all')}
            size="sm"
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            className={filterStatus === 'all' ? 
              'bg-indigo-600 hover:bg-indigo-700 text-white' : 
              'border-slate-600 hover:bg-slate-700 text-slate-300'
            }
          >
            All
          </Button>
          <Button
            onClick={() => setFilterStatus('active')}
            size="sm"
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            className={filterStatus === 'active' ? 
              'bg-emerald-600 hover:bg-emerald-700 text-white' : 
              'border-slate-600 hover:bg-slate-700 text-slate-300'
            }
          >
            Active
          </Button>
          <Button
            onClick={() => setFilterStatus('inactive')}
            size="sm"
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            className={filterStatus === 'inactive' ? 
              'bg-red-600 hover:bg-red-700 text-white' : 
              'border-slate-600 hover:bg-slate-700 text-slate-300'
            }
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Workflows List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/30 rounded-xl p-4 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-700 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                {searchTerm ? 'No matching workflows' : 'No workflows found'}
              </h3>
              <p className="text-sm text-slate-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first workflow to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-200 truncate group-hover:text-indigo-200 transition-colors">
                          {workflow.name}
                        </h3>
                        <Badge variant={workflow.active ? 'default' : 'secondary'} className={
                          workflow.active ? 
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }>
                          {workflow.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {workflow.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedWorkflow(expandedWorkflow === workflow.id ? null : workflow.id)}
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {expandedWorkflow === workflow.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {workflow.nodes} nodes
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {workflow.triggerCount} runs
                      </span>
                    </div>
                    {workflow.status && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${getStatusColor(workflow.status)}`}>
                        {getStatusIcon(workflow.status)}
                        <span className="capitalize">{workflow.status}</span>
                      </div>
                    )}
                  </div>

                  {expandedWorkflow === workflow.id && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Created:</span>
                        <span className="text-slate-400">{formatDate(workflow.createdAt)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Updated:</span>
                        <span className="text-slate-400">{formatDate(workflow.updatedAt)}</span>
                      </div>
                      {workflow.lastExecution && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Last run:</span>
                          <span className="text-slate-400">{formatDate(workflow.lastExecution)}</span>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/20">
                          <Settings className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/20">
                          <Play className="w-3 h-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 