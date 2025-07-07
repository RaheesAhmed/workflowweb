import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = parseInt(params.id)
    
    if (isNaN(workflowId)) {
      return NextResponse.json({ error: 'Invalid workflow ID' }, { status: 400 })
    }

    // Check if workflow exists
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { id: true, name: true }
    })

    if (!existingWorkflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Delete the workflow
    await prisma.workflow.delete({
      where: { id: workflowId }
    })

    return NextResponse.json({ 
      message: 'Workflow deleted successfully',
      deletedWorkflow: existingWorkflow 
    })
  } catch (error) {
    console.error('Failed to delete workflow:', error)
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 })
  }
} 