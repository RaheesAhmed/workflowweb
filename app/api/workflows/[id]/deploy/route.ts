import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { n8nService } from '@/services/n8nService'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = parseInt(params.id)
    
    // Get workflow from database
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: {
        id: true,
        filename: true,
        name: true,
        description: true
      }
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Read the actual workflow file
    const filePath = join(process.cwd(), 'utils', 'workflow-templates', workflow.filename)
    
    try {
      const fileContent = await readFile(filePath, 'utf-8')
      const workflowData = JSON.parse(fileContent)
      
      // Deploy to n8n using the n8n service
      const deployResult = await n8nService.createWorkflow(workflowData)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Workflow deployed successfully',
        workflowId: deployResult.id,
        workflowName: deployResult.name 
      })
    } catch (fileError) {
      console.error('Error reading workflow file:', fileError)
      return NextResponse.json({ error: 'Workflow file not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to deploy workflow:', error)
    return NextResponse.json({ 
      error: 'Failed to deploy workflow', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 