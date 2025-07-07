import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        filename: true,
        name: true,
        triggerType: true,
        complexity: true,
        nodeCount: true,
        integrations: true,
        description: true
      },
      orderBy: [
        { nodeCount: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(workflows)
  } catch (error) {
    console.error('Failed to fetch workflows:', error)
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 })
  }
} 