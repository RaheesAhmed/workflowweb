'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Trash2, 
  Search, 
  Settings, 
  BarChart3,
  Users,
  FileText,
  Database,
  Zap,
  Clock,
  ExternalLink,
  Activity,
  Shield
} from 'lucide-react'
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

function AdminSidebar() {
  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: false },
    { icon: Database, label: 'Workflows', active: true },
    { icon: Users, label: 'Users', active: false },
    { icon: Activity, label: 'Analytics', active: false },
    { icon: FileText, label: 'Logs', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ]

  return (
    <div className="w-64 lg:w-80 bg-card border-r border-border p-4 lg:p-8 space-y-8 lg:space-y-12">
      {/* Logo */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-xs lg:text-sm text-muted-foreground">WorkFlow AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 lg:space-y-3">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-colors ${
              item.active 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-sm lg:text-base font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Stats */}
      <div className="space-y-4 lg:space-y-6">
        <div className="text-xs lg:text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Quick Stats
        </div>
        <div className="space-y-3 lg:space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 lg:p-4">
            <div className="text-2xl lg:text-3xl font-bold text-foreground">1,247</div>
            <div className="text-xs lg:text-sm text-muted-foreground">Total Workflows</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 lg:p-4">
            <div className="text-2xl lg:text-3xl font-bold text-foreground">98.5%</div>
            <div className="text-xs lg:text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workflows')
      if (!response.ok) throw new Error('Failed to fetch workflows')
      const data = await response.json()
      setWorkflows(data)
    } catch (error) {
      console.error('Error fetching workflows:', error)
      toast.error('Failed to load workflows')
    } finally {
      setLoading(false)
    }
  }

  const handleWorkflowDelete = async (workflowId: number, workflowName: string) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete workflow')
      }
      
      toast.success(`Workflow "${workflowName}" deleted successfully!`)
      setWorkflows(workflows.filter(w => w.id !== workflowId))
    } catch (error) {
      toast.error('Failed to delete workflow')
      console.error('Delete error:', error)
    }
  }

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.triggerType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-500/20 text-green-400'
      case 'Medium': return 'bg-amber-500/20 text-amber-400'
      case 'Complex': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTriggerIcon = (triggerType: string) => {
    if (triggerType.includes('Manual')) return <Settings className="w-4 h-4" />
    if (triggerType.includes('Webhook')) return <Zap className="w-4 h-4" />
    if (triggerType.includes('Scheduled')) return <Clock className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Toaster />
      
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 min-w-0">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">
              Workflow Management
            </h1>
            <p className="text-muted-foreground">
              Manage all workflows in your platform
            </p>
          </div>

          {/* Search and Stats */}
          <div className="mb-6 lg:mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={fetchWorkflows} className="w-full sm:w-auto">
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                      <p className="text-lg lg:text-2xl font-bold text-foreground">{workflows.length}</p>
                    </div>
                    <Database className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-muted-foreground">Simple</p>
                      <p className="text-lg lg:text-2xl font-bold text-green-500">
                        {workflows.filter(w => w.complexity === 'Simple').length}
                      </p>
                    </div>
                    <Activity className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-muted-foreground">Complex</p>
                      <p className="text-lg lg:text-2xl font-bold text-red-500">
                        {workflows.filter(w => w.complexity === 'Complex').length}
                      </p>
                    </div>
                    <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 lg:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-muted-foreground">Filtered</p>
                      <p className="text-lg lg:text-2xl font-bold text-primary">
                        {filteredWorkflows.length}
                      </p>
                    </div>
                    <Search className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Workflows Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ID</TableHead>
                      <TableHead className="min-w-48">Name</TableHead>
                      <TableHead className="w-32">Type</TableHead>
                      <TableHead className="w-24">Complexity</TableHead>
                      <TableHead className="w-20">Nodes</TableHead>
                      <TableHead className="min-w-32">Integrations</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 10 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><div className="h-4 bg-muted rounded w-12"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-32"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-8"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
                          <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
                        </TableRow>
                      ))
                    ) : filteredWorkflows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            {searchTerm ? 'No workflows found matching your search' : 'No workflows available'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWorkflows.map((workflow) => (
                        <TableRow key={workflow.id}>
                          <TableCell className="font-mono text-sm">{workflow.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{workflow.name}</div>
                              {workflow.description && (
                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                  {workflow.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {getTriggerIcon(workflow.triggerType)}
                              <span className="ml-1">{workflow.triggerType}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${getComplexityColor(workflow.complexity)}`}>
                              {workflow.complexity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>{workflow.nodeCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {Array.isArray(workflow.integrations) && workflow.integrations.slice(0, 3).map((integration: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {integration}
                                </Badge>
                              ))}
                              {Array.isArray(workflow.integrations) && workflow.integrations.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{workflow.integrations.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => window.open(`/marketplace?workflow=${workflow.id}`, '_blank')}
                                title="View in marketplace"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 border-red-500 text-red-500 hover:bg-red-500/10"
                                    title="Delete workflow"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the workflow "{workflow.name}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleWorkflowDelete(workflow.id, workflow.name)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 