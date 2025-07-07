import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
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
      
      // Create the download response
      const response = new NextResponse(JSON.stringify(workflowData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${workflow.filename}"`,
          'Cache-Control': 'no-cache'
        }
      })
      
      return response
    } catch (fileError) {
      console.error('Error reading workflow file:', fileError)
      return NextResponse.json({ error: 'Workflow file not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to download workflow:', error)
    return NextResponse.json({ error: 'Failed to download workflow' }, { status: 500 })
  }
} 