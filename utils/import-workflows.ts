import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

interface N8nWorkflow {
  name?: string
  active?: boolean
  nodes?: Array<{
    type: string
    typeVersion?: number
  }>
  connections?: any
  settings?: any
  staticData?: any
  tags?: string[]
  triggerCount?: number
  [key: string]: any
}

export async function importWorkflowTemplates() {
  const templatesDir = path.join(process.cwd(), 'utils', 'workflow-templates')
  
  if (!fs.existsSync(templatesDir)) {
    console.log('Templates directory not found:', templatesDir)
    return
  }

  const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'))
  console.log(`Found ${files.length} workflow files`)

  const results = {
    imported: 0,
    updated: 0,
    errors: 0,
    skipped: 0
  }

  for (const filename of files) {
    try {
      const filePath = path.join(templatesDir, filename)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const fileHash = crypto.createHash('md5').update(fileContent).digest('hex')
      
      // Check if already imported with same hash
      const existing = await prisma.workflow.findUnique({
        where: { filename }
      })

      if (existing && existing.fileHash === fileHash) {
        results.skipped++
        continue
      }

      const workflowData: N8nWorkflow = JSON.parse(fileContent)
      
      // Extract workflow metadata
      const name = workflowData.name || filename.replace('.json', '').replace(/^\d+_/, '').replace(/_/g, ' ')
      const active = workflowData.active !== false
      const nodes = workflowData.nodes || []
      const nodeCount = nodes.length
      
      // Determine trigger type
      const triggerTypes = nodes
        .filter(node => node.type.toLowerCase().includes('trigger') || 
                       node.type === 'Webhook' || 
                       node.type === 'Cron' ||
                       node.type === 'Manual' ||
                       node.type === 'Schedule')
        .map(node => node.type)
      
      let triggerType = 'Manual'
      if (triggerTypes.some(t => t.includes('Webhook'))) triggerType = 'Webhook'
      else if (triggerTypes.some(t => t.includes('Cron') || t.includes('Schedule'))) triggerType = 'Scheduled'
      else if (triggerTypes.some(t => t.includes('Manual'))) triggerType = 'Manual'
      
      // Determine complexity based on node count and connections
      let complexity = 'Simple'
      if (nodeCount > 10) complexity = 'Complex'
      else if (nodeCount > 5) complexity = 'Medium'
      
      // Extract unique integrations/services
      const integrations = [...new Set(nodes.map(node => {
        // Clean up node type names
        let service = node.type
        if (service.startsWith('n8n-nodes-base.')) {
          service = service.replace('n8n-nodes-base.', '')
        }
        return service
      }))].filter(Boolean)

      // Generate description from filename and integrations
      const description = `n8n workflow integrating ${integrations.slice(0, 3).join(', ')}${
        integrations.length > 3 ? ` and ${integrations.length - 3} more services` : ''
      }. ${complexity.toLowerCase()} automation with ${nodeCount} nodes.`

      const workflowRecord = {
        filename,
        name,
        active,
        triggerType,
        complexity,
        nodeCount,
        integrations,
        description,
        fileHash,
        analyzedAt: new Date()
      }

      if (existing) {
        await prisma.workflow.update({
          where: { id: existing.id },
          data: workflowRecord
        })
        results.updated++
        console.log(`Updated: ${name}`)
      } else {
        await prisma.workflow.create({
          data: workflowRecord
        })
        results.imported++
        console.log(`Imported: ${name}`)
      }

    } catch (error) {
      console.error(`Error processing ${filename}:`, error)
      results.errors++
    }
  }

  console.log('Import complete:', results)
  return results
}

// Utility to create default categories
export async function createDefaultCategories() {
  const categories = [
    { name: 'Data Sync', description: 'Synchronize data between different platforms', icon: '🔄' },
    { name: 'Notifications', description: 'Send alerts and notifications', icon: '📢' },
    { name: 'CRM Automation', description: 'Customer relationship management workflows', icon: '👥' },
    { name: 'Content Management', description: 'Manage and publish content automatically', icon: '📝' },
    { name: 'E-commerce', description: 'Online store and sales automation', icon: '🛒' },
    { name: 'Social Media', description: 'Social media management and posting', icon: '📱' },
    { name: 'File Processing', description: 'Automate file operations and transformations', icon: '📁' },
    { name: 'Analytics', description: 'Data analysis and reporting workflows', icon: '📊' },
    { name: 'Communication', description: 'Team communication and collaboration', icon: '💬' },
    { name: 'Backup & Monitoring', description: 'System backups and monitoring', icon: '🔒' }
  ]

  for (const category of categories) {
    await prisma.workflowCategory.upsert({
      where: { name: category.name },
      update: category,
      create: category
    })
  }

  console.log('Created default categories')
}

// CLI function to run imports
export async function runImport() {
  console.log('Starting workflow import...')
  
  try {
    await createDefaultCategories()
    await importWorkflowTemplates()
    console.log('Import completed successfully!')
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
} 