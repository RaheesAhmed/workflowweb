import { supabase } from '@/lib/supabase'

export interface WorkflowSearchParams {
  query?: string
  triggerType?: string
  complexity?: string
  minNodes?: number
  maxNodes?: number
  integration?: string
  limit?: number
}

export interface WorkflowResult {
  id: number
  filename: string
  name: string
  active: boolean
  trigger_type: string
  complexity: string
  node_count: number
  integrations: string[]
  description: string | null
  created_at: string
}

export interface WorkflowSearchResponse {
  workflows: WorkflowResult[]
  metadata: {
    totalResults: number
    availableIntegrations: string[]
    availableTriggerTypes: string[]
    searchQuery?: string
    filters: any
  }
}

class WorkflowDatabaseService {
  async searchWorkflows(params: WorkflowSearchParams): Promise<WorkflowSearchResponse> {
    try {
      const {
        query,
        triggerType,
        complexity,
        minNodes,
        maxNodes,
        integration,
        limit = 20
      } = params

      let supabaseQuery = supabase
        .from('workflows')
        .select('*')
        .eq('active', true)

      // Apply filters
      if (query) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      }

      if (triggerType) {
        supabaseQuery = supabaseQuery.eq('trigger_type', triggerType)
      }

      if (complexity) {
        supabaseQuery = supabaseQuery.eq('complexity', complexity)
      }

      if (minNodes) {
        supabaseQuery = supabaseQuery.gte('node_count', minNodes)
      }

      if (maxNodes) {
        supabaseQuery = supabaseQuery.lte('node_count', maxNodes)
      }

      if (integration) {
        supabaseQuery = supabaseQuery.contains('integrations', [integration])
      }

      // Order by created_at desc and limit results
      supabaseQuery = supabaseQuery
        .order('created_at', { ascending: false })
        .limit(limit)

      const { data: workflows, error } = await supabaseQuery

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Get metadata about available options
      const { data: integrationData } = await supabase
        .from('workflows')
        .select('integrations')
        .eq('active', true)

      const { data: triggerData } = await supabase
        .from('workflows')
        .select('trigger_type')
        .eq('active', true)

      const allIntegrations = new Set<string>()
      integrationData?.forEach(item => {
        if (Array.isArray(item.integrations)) {
          item.integrations.forEach((integration: string) => allIntegrations.add(integration))
        }
      })

      const allTriggerTypes = new Set(triggerData?.map(item => item.trigger_type))

      return {
        workflows: workflows || [],
        metadata: {
          totalResults: workflows?.length || 0,
          availableIntegrations: Array.from(allIntegrations).sort(),
          availableTriggerTypes: Array.from(allTriggerTypes).sort(),
          searchQuery: query,
          filters: {
            triggerType,
            complexity,
            minNodes,
            maxNodes,
            integration
          }
        }
      }

    } catch (error) {
      console.error('Workflow search error:', error)
      throw error
    }
  }

  async getWorkflowsByIntegration(integrations: string[], limit = 10): Promise<WorkflowResult[]> {
    try {
      let query = supabase
        .from('workflows')
        .select('*')
        .eq('active', true)

      // Search for workflows that contain any of the specified integrations
      if (integrations.length > 0) {
        const integrationConditions = integrations.map(integration =>
          `integrations.cs.["${integration}"]`
        ).join(',')
        query = query.or(integrationConditions)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Get workflows by integration error:', error)
      throw error
    }
  }

  async getPopularIntegrations(limit = 20): Promise<{ integration: string, count: number }[]> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('integrations')
        .eq('active', true)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      const integrationCounts = new Map<string, number>()
      
      data?.forEach(workflow => {
        if (Array.isArray(workflow.integrations)) {
          workflow.integrations.forEach((integration: string) => {
            integrationCounts.set(integration, (integrationCounts.get(integration) || 0) + 1)
          })
        }
      })

      return Array.from(integrationCounts.entries())
        .map(([integration, count]) => ({ integration, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)

    } catch (error) {
      console.error('Get popular integrations error:', error)
      throw error
    }
  }

  async getWorkflowStats(): Promise<{
    totalWorkflows: number
    totalIntegrations: number
    averageNodeCount: number
    triggerTypeDistribution: { [key: string]: number }
    complexityDistribution: { [key: string]: number }
  }> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('trigger_type, complexity, node_count, integrations')
        .eq('active', true)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      const stats = {
        totalWorkflows: data?.length || 0,
        totalIntegrations: 0,
        averageNodeCount: 0,
        triggerTypeDistribution: {} as { [key: string]: number },
        complexityDistribution: {} as { [key: string]: number }
      }

      if (data) {
        const allIntegrations = new Set<string>()
        let totalNodes = 0

        data.forEach(workflow => {
          // Count trigger types
          stats.triggerTypeDistribution[workflow.trigger_type] = 
            (stats.triggerTypeDistribution[workflow.trigger_type] || 0) + 1

          // Count complexity levels
          stats.complexityDistribution[workflow.complexity] = 
            (stats.complexityDistribution[workflow.complexity] || 0) + 1

          // Count nodes
          totalNodes += workflow.node_count

          // Count unique integrations
          if (Array.isArray(workflow.integrations)) {
            workflow.integrations.forEach((integration: string) => {
              allIntegrations.add(integration)
            })
          }
        })

        stats.totalIntegrations = allIntegrations.size
        stats.averageNodeCount = data.length > 0 ? Math.round(totalNodes / data.length) : 0
      }

      return stats
    } catch (error) {
      console.error('Get workflow stats error:', error)
      throw error
    }
  }
}

export const workflowDatabaseService = new WorkflowDatabaseService() 