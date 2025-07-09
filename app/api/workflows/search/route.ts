import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const triggerType = searchParams.get('trigger_type')
    const complexity = searchParams.get('complexity')
    const minNodes = searchParams.get('min_nodes')
    const maxNodes = searchParams.get('max_nodes')
    const integration = searchParams.get('integration')
    const limit = parseInt(searchParams.get('limit') || '20')

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
      supabaseQuery = supabaseQuery.gte('node_count', parseInt(minNodes))
    }

    if (maxNodes) {
      supabaseQuery = supabaseQuery.lte('node_count', parseInt(maxNodes))
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
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to search workflows' },
        { status: 500 }
      )
    }

    // Get unique integrations and trigger types for metadata
    const { data: integrationData } = await supabase
      .from('workflows')
      .select('integrations')
      .eq('active', true)

    const { data: triggerData } = await supabase
      .from('workflows')
      .select('trigger_type')
      .eq('active', true)

    const allIntegrations = new Set()
    integrationData?.forEach(item => {
      if (Array.isArray(item.integrations)) {
        item.integrations.forEach((integration: string) => allIntegrations.add(integration))
      }
    })

    const allTriggerTypes = new Set(triggerData?.map(item => item.trigger_type))

    return NextResponse.json({
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
    })

  } catch (error) {
    console.error('Search workflows error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      searchTerms = [], 
      integrations = [], 
      triggerTypes = [], 
      complexityLevels = [],
      nodeCountRange = {},
      limit = 20 
    } = body

    let supabaseQuery = supabase
      .from('workflows')
      .select('id, name, description, trigger_type, complexity, node_count, integrations, created_at')
      .eq('active', true)

    // Search in name and description
    if (searchTerms.length > 0) {
      const searchConditions = searchTerms.map((term: string) => 
        `name.ilike.%${term}%,description.ilike.%${term}%`
      ).join(',')
      supabaseQuery = supabaseQuery.or(searchConditions)
    }

    // Filter by integrations
    if (integrations.length > 0) {
      const integrationConditions = integrations.map((integration: string) =>
        `integrations.cs.["${integration}"]`
      ).join(',')
      supabaseQuery = supabaseQuery.or(integrationConditions)
    }

    // Filter by trigger types
    if (triggerTypes.length > 0) {
      supabaseQuery = supabaseQuery.in('trigger_type', triggerTypes)
    }

    // Filter by complexity
    if (complexityLevels.length > 0) {
      supabaseQuery = supabaseQuery.in('complexity', complexityLevels)
    }

    // Filter by node count range
    if (nodeCountRange.min) {
      supabaseQuery = supabaseQuery.gte('node_count', nodeCountRange.min)
    }
    if (nodeCountRange.max) {
      supabaseQuery = supabaseQuery.lte('node_count', nodeCountRange.max)
    }

    // Order and limit
    supabaseQuery = supabaseQuery
      .order('created_at', { ascending: false })
      .limit(limit)

    const { data: workflows, error } = await supabaseQuery

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to search workflows' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      workflows: workflows || [],
      totalResults: workflows?.length || 0
    })

  } catch (error) {
    console.error('Advanced search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 