'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Download, 
  Search, 
  Filter, 
  Zap, 
  Clock,
  Settings,
  Heart,
  Play,
  Share2,
  ExternalLink
} from 'lucide-react'
import Header from '@/components/Header'
import { useN8n } from '@/hooks/useN8n'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

interface Workflow {
  id: number
  filename: string
  name: string
  triggerType: string
  complexity: string
  nodeCount: number
  integrations: any
  description: string | null
}

interface WorkflowCardProps {
  workflow: Workflow
}

function WorkflowCard({ workflow }: WorkflowCardProps) {
  const integrations = Array.isArray(workflow.integrations) ? workflow.integrations : []
  const { activeConnection, createWorkflow } = useN8n()
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'Complex': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTriggerIcon = (triggerType: string) => {
    if (triggerType.includes('Manual')) return <Settings className="w-4 h-4" />
    if (triggerType.includes('Webhook')) return <Zap className="w-4 h-4" />
    if (triggerType.includes('Scheduled')) return <Clock className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflow.id}/download`)
      if (!response.ok) {
        throw new Error('Failed to download workflow')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = workflow.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Workflow downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download workflow')
      console.error('Download error:', error)
    }
  }

  const handleDeploy = async () => {
    if (!activeConnection) {
      toast.error('Please connect to n8n first')
      return
    }

    try {
      const response = await fetch(`/api/workflows/${workflow.id}/deploy`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to deploy workflow')
      }
      
      const result = await response.json()
      toast.success(`Workflow "${result.workflowName}" deployed successfully!`)
    } catch (error) {
      toast.error('Failed to deploy workflow')
      console.error('Deploy error:', error)
    }
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/marketplace?workflow=${workflow.id}`
      
      if (navigator.share) {
        await navigator.share({
          title: workflow.name,
          text: workflow.description || 'Check out this n8n workflow',
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Workflow link copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to share workflow')
      console.error('Share error:', error)
    }
  }

  return (
    <Card id={`workflow-${workflow.id}`} className="card-glass hover:border-primary-500/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                {workflow.name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`text-xs border-0 ${getComplexityColor(workflow.complexity)}`}>
                  {workflow.complexity}
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300 bg-gray-800/30">
                  {getTriggerIcon(workflow.triggerType)}
                  <span className="ml-1">{workflow.triggerType}</span>
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Description */}
          {workflow.description && (
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {workflow.description}
            </p>
          )}
          
          {/* Integrations */}
          <div>
            <div className="flex flex-wrap gap-1 mb-3">
              {integrations.slice(0, 5).map((integration: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-primary-500/10 text-primary-300 border-primary-500/20 hover:bg-primary-500/20 transition-colors"
                >
                  {integration}
                </Badge>
              ))}
              {integrations.length > 5 && (
                <Badge variant="secondary" className="text-xs bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-colors">
                  +{integrations.length - 5}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>{workflow.nodeCount} nodes</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 group/btn"
                onClick={handleDownload}
                title="Download workflow"
              >
                <Download className="w-4 h-4 text-blue-400 group-hover/btn:scale-110 transition-transform" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className={`h-8 w-8 p-0 border-gray-600 transition-all duration-200 group/btn ${
                  activeConnection 
                    ? 'hover:border-green-500 hover:bg-green-500/10' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={handleDeploy}
                title={activeConnection ? "Deploy to n8n" : "Connect to n8n to deploy workflows"}
                disabled={!activeConnection}
              >
                <Play className={`w-4 h-4 group-hover/btn:scale-110 transition-transform ${activeConnection ? 'text-green-400' : 'text-gray-500'}`} />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 border-gray-600 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-200 group/btn"
                onClick={handleShare}
                title="Share workflow"
              >
                <Share2 className="w-4 h-4 text-purple-400 group-hover/btn:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MarketplaceLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="card-glass animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-700 rounded w-16"></div>
                    <div className="h-5 bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-8 w-8 bg-gray-700 rounded"></div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
              
              {/* Integrations */}
              <div className="flex gap-1">
                <div className="h-5 bg-gray-700 rounded w-16"></div>
                <div className="h-5 bg-gray-700 rounded w-20"></div>
                <div className="h-5 bg-gray-700 rounded w-12"></div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MarketplacePage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const { activeConnection, loadConnections } = useN8n()

  // Fetch workflows on component mount
  useEffect(() => {
    fetchWorkflows()
    loadConnections()
  }, [])

  // Handle shared workflow highlighting
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const workflowId = params.get('workflow')
    if (workflowId) {
      // Scroll to the workflow card after a short delay
      setTimeout(() => {
        const element = document.getElementById(`workflow-${workflowId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.classList.add('ring-2', 'ring-primary-500', 'ring-opacity-50')
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary-500', 'ring-opacity-50')
          }, 3000)
        }
      }, 1000)
    }
  }, [workflows])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      // Ensure data is an array
      setWorkflows(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
      setWorkflows([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Filter workflows based on search and filter
  const filteredWorkflows = useMemo(() => {
    let filtered = workflows

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(workflow => 
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(workflow.integrations) && 
         workflow.integrations.some((integration: string) => 
           integration.toLowerCase().includes(searchTerm.toLowerCase())
         ))
      )
    }

    // Apply complexity filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(workflow => workflow.complexity === activeFilter)
    }

    return filtered
  }, [workflows, searchTerm, activeFilter])

  // Get stats for the filtered workflows
  const stats = useMemo(() => {
    // Ensure workflows is an array before using reduce
    if (!Array.isArray(workflows)) {
      return {}
    }
    
    const complexityStats = workflows.reduce((acc, workflow) => {
      acc[workflow.complexity] = (acc[workflow.complexity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return complexityStats
  }, [workflows])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            <span className="text-gradient-ai animate-shimmer">n8n</span> Workflow{' '}
            <span className="text-gradient-ai animate-shimmer">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover and download production-ready n8n workflows. 
            
          </p>
        </div>

        {/* n8n Connection Status */}
        {activeConnection ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-green-400 font-medium">Connected to n8n</p>
                <p className="text-green-300/80 text-sm">
                  {activeConnection.instance_name} - Ready to deploy workflows
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <div>
                <p className="text-amber-400 font-medium">n8n Not Connected</p>
                <p className="text-amber-300/80 text-sm">
                  Connect to n8n to deploy workflows directly. You can still download them.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search workflows, integrations, or descriptions..." 
              className="pl-10 bg-white/5 border-gray-600 text-white placeholder:text-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              className={activeFilter === 'all' ? 'btn-premium' : 'border-gray-600 text-gray-300'}
              onClick={() => handleFilterChange('all')}
            >
              <Filter className="w-4 h-4 mr-2" />
              All
            </Button>
            <Button 
              variant={activeFilter === 'Simple' ? 'default' : 'outline'}
              className={activeFilter === 'Simple' ? 'btn-premium' : 'border-gray-600 text-gray-300'}
              onClick={() => handleFilterChange('Simple')}
            >
              Simple
            </Button>
            <Button 
              variant={activeFilter === 'Medium' ? 'default' : 'outline'}
              className={activeFilter === 'Medium' ? 'btn-premium' : 'border-gray-600 text-gray-300'}
              onClick={() => handleFilterChange('Medium')}
            >
              Medium
            </Button>
            <Button 
              variant={activeFilter === 'Complex' ? 'default' : 'outline'}
              className={activeFilter === 'Complex' ? 'btn-premium' : 'border-gray-600 text-gray-300'}
              onClick={() => handleFilterChange('Complex')}
            >
              Complex
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-glass text-center hover:border-primary-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {filteredWorkflows.length}
              </div>
              <div className="text-gray-300 font-medium">
                {searchTerm || activeFilter !== 'all' ? 'Filtered' : 'Total'} Workflows
              </div>
              <div className="text-sm text-gray-400 mt-1">Ready to deploy</div>
            </CardContent>
          </Card>
          
          <Card className="card-glass text-center hover:border-emerald-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.Simple || 0}
              </div>
              <div className="text-gray-300 font-medium">Simple</div>
              <div className="text-sm text-gray-400 mt-1">Quick to set up</div>
            </CardContent>
          </Card>
          
          <Card className="card-glass text-center hover:border-amber-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.Medium || 0}
              </div>
              <div className="text-gray-300 font-medium">Medium</div>
              <div className="text-sm text-gray-400 mt-1">Balanced complexity</div>
            </CardContent>
          </Card>
          
          <Card className="card-glass text-center hover:border-red-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stats.Complex || 0}
              </div>
              <div className="text-gray-300 font-medium">Complex</div>
              <div className="text-sm text-gray-400 mt-1">Advanced automation</div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {loading ? (
          <MarketplaceLoading />
        ) : (
          <div className="space-y-8">
            {/* Workflows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
            
            {filteredWorkflows.length === 0 && !loading && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-300 mb-2">No workflows found</h3>
                <p className="text-gray-400">
                  {searchTerm ? 'Try a different search term' : 'Try adjusting your filter criteria'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Toaster />
    </main>
  )
}
