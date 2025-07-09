export function isWorkflowJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString)
    
    // Check for n8n workflow structure
    if (
      parsed &&
      typeof parsed === 'object' &&
      (
        // Check for typical n8n workflow properties
        (parsed.nodes && Array.isArray(parsed.nodes)) ||
        (parsed.connections && typeof parsed.connections === 'object') ||
        (parsed.name && typeof parsed.name === 'string' && parsed.nodes) ||
        // Check for workflow metadata
        (parsed.meta && parsed.meta.instanceId) ||
        (parsed.settings && parsed.active !== undefined)
      )
    ) {
      return true
    }
    
    return false
  } catch (error) {
    return false
  }
}

export function extractWorkflowTitle(jsonString: string): string | null {
  try {
    const parsed = JSON.parse(jsonString)
    return parsed.name || null
  } catch (error) {
    return null
  }
} 