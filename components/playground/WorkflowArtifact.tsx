'use client'

import { useState, useEffect } from 'react'
import { useN8n } from '@/hooks/useN8n'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play,
  Download,
  Copy,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Workflow,
  Zap,
  Settings,
  ExternalLink,
  FileCode,
  Braces
} from 'lucide-react'
import { toast } from 'sonner'

interface WorkflowArtifactProps {
  workflowJson: string
  title?: string
  className?: string
}

interface WorkflowNode {
  id: string
  name: string
  type: string
  position: [number, number]
  parameters?: any
}

interface ParsedWorkflow {
  name?: string
  nodes?: WorkflowNode[]
  connections?: any
  active?: boolean
  tags?: string[]
  settings?: any
}

export function WorkflowArtifact({ workflowJson, title, className }: WorkflowArtifactProps) {
  const { activeConnection, createWorkflow, loading } = useN8n()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploySuccess, setDeploySuccess] = useState(false)
  const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)

  // Parse workflow JSON
  useEffect(() => {
    try {
      const parsed = JSON.parse(workflowJson)
      setParsedWorkflow(parsed)
    } catch (error) {
      console.error('Failed to parse workflow JSON:', error)
    }
  }, [workflowJson])

  const nodeCount = parsedWorkflow?.nodes?.length || 0
  const workflowName = parsedWorkflow?.name || title || 'Generated Workflow'
  const isActive = parsedWorkflow?.active || false

  const handleDeploy = async () => {
    if (!activeConnection) {
      toast.error('No n8n connection found. Please connect your n8n instance first.')
      return
    }

    if (!parsedWorkflow) {
      toast.error('Invalid workflow data. Please check the JSON format.')
      return
    }

    setIsDeploying(true)
    try {
      // Only send the essential fields that n8n accepts for workflow creation
      const workflowToDeployData = {
        name: parsedWorkflow.name || workflowName,
        nodes: parsedWorkflow.nodes || [],
        connections: parsedWorkflow.connections || {}
      }
      
      // Only add settings if they exist and are not empty
      if (parsedWorkflow.settings && Object.keys(parsedWorkflow.settings).length > 0) {
        workflowToDeployData.settings = parsedWorkflow.settings
      }

      console.log('Deploying workflow with data:', workflowToDeployData)
      
      const result = await createWorkflow(workflowToDeployData)
      setDeploySuccess(true)
      toast.success(`✅ Workflow "${workflowName}" deployed successfully to n8n!`)
      
      console.log('Deployment result:', result)
    } catch (error) {
      console.error('Deploy failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to deploy workflow: ${errorMessage}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(workflowJson)
      toast.success('✅ Workflow JSON copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([workflowJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('✅ Workflow downloaded!')
  }

  const openInN8n = () => {
    if (activeConnection?.base_url) {
      window.open(`${activeConnection.base_url}/workflow/new`, '_blank')
      toast.success('Opening n8n in new tab...')
    } else {
      toast.error('No n8n connection found')
    }
  }

  return (
    <Card className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/50 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-indigo-300 mb-1">
                {deploySuccess ? '🚀 Deployed Workflow' : '⚡ Generated Workflow'}
              </h3>
              <h4 className="text-white font-medium text-base mb-2 truncate">
                {workflowName}
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                  <Braces className="w-3 h-3 mr-1" />
                  {nodeCount} nodes
                </Badge>
                {isActive && (
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
                {parsedWorkflow?.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-200 p-2"
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleDeploy}
            disabled={isDeploying || !activeConnection || deploySuccess}
            className={`${
              deploySuccess 
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border-indigo-500/30'
            } transition-all duration-200`}
            size="sm"
          >
            {isDeploying ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : deploySuccess ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {deploySuccess ? 'Deployed' : 'Deploy to n8n'}
          </Button>

          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="border-slate-600 hover:bg-slate-700 text-slate-300"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy JSON
          </Button>

          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="border-slate-600 hover:bg-slate-700 text-slate-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          {activeConnection && (
            <Button
              onClick={openInN8n}
              variant="outline"
              size="sm"
              className="border-emerald-600/50 hover:bg-emerald-600/20 text-emerald-400"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open n8n
            </Button>
          )}
        </div>

        {!activeConnection && (
          <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Connect your n8n instance to deploy workflows</span>
          </div>
        )}
      </CardHeader>

      {/* Expanded JSON View */}
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border border-slate-600/50 rounded-lg bg-slate-900/50 overflow-hidden">
            <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 border-b border-slate-600/50">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">workflow.json</span>
              </div>
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-400 text-xs">
                {(new Blob([workflowJson]).size / 1024).toFixed(1)} KB
              </Badge>
            </div>
            <pre className="p-4 text-sm text-slate-300 overflow-x-auto max-h-96 overflow-y-auto">
              <code>{JSON.stringify(parsedWorkflow, null, 2)}</code>
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 