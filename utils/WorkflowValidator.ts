import { N8nWorkflowData, N8nNode } from '../components/WorkflowArtifact';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  enhancements: WorkflowEnhancement[];
}

export interface ValidationError {
  type: 'missing_field' | 'invalid_format' | 'connection_error' | 'node_config_error';
  message: string;
  nodeId?: string;
  field?: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface ValidationWarning {
  type: 'performance' | 'best_practice' | 'security' | 'maintainability';
  message: string;
  nodeId?: string;
  suggestion?: string;
}

export interface WorkflowEnhancement {
  type: 'node_description' | 'connection_validation' | 'performance_optimization';
  applied: boolean;
  description: string;
  nodeId?: string;
}

export class WorkflowValidator {
  /**
   * Validates and enhances an n8n workflow
   */
  static validateAndEnhance(workflow: N8nWorkflowData): {
    validatedWorkflow: N8nWorkflowData;
    result: ValidationResult;
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const enhancements: WorkflowEnhancement[] = [];

    // Create a copy for enhancement
    const enhancedWorkflow: N8nWorkflowData = JSON.parse(JSON.stringify(workflow));

    // Validate basic workflow structure
    this.validateBasicStructure(enhancedWorkflow, errors);

    // Validate and enhance nodes
    this.validateAndEnhanceNodes(enhancedWorkflow, errors, warnings, enhancements);

    // Validate connections
    this.validateConnections(enhancedWorkflow, errors, warnings);

    // Apply performance optimizations
    this.applyPerformanceEnhancements(enhancedWorkflow, warnings, enhancements);

    // Add security recommendations
    this.addSecurityRecommendations(enhancedWorkflow, warnings);

    const result: ValidationResult = {
      isValid: errors.filter(e => e.severity === 'critical').length === 0,
      errors,
      warnings,
      enhancements
    };

    return {
      validatedWorkflow: enhancedWorkflow,
      result
    };
  }

  /**
   * Validates basic workflow structure
   */
  private static validateBasicStructure(workflow: N8nWorkflowData, errors: ValidationError[]): void {
    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push({
        type: 'missing_field',
        message: 'Workflow must have a name',
        field: 'name',
        severity: 'medium'
      });
    }

    if (!workflow.nodes || !Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
      errors.push({
        type: 'missing_field',
        message: 'Workflow must contain at least one node',
        field: 'nodes',
        severity: 'critical'
      });
    }

    if (!workflow.connections || typeof workflow.connections !== 'object') {
      workflow.connections = {};
    }
  }

  /**
   * Validates and enhances individual nodes
   */
  private static validateAndEnhanceNodes(
    workflow: N8nWorkflowData,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    enhancements: WorkflowEnhancement[]
  ): void {
    const nodeIds = new Set<string>();

    workflow.nodes.forEach((node, index) => {
      // Validate node ID uniqueness
      if (!node.id) {
        node.id = `node-${index}-${Date.now()}`;
        enhancements.push({
          type: 'node_description',
          applied: true,
          description: `Generated missing ID for node: ${node.name}`,
          nodeId: node.id
        });
      }

      if (nodeIds.has(node.id)) {
        errors.push({
          type: 'invalid_format',
          message: `Duplicate node ID: ${node.id}`,
          nodeId: node.id,
          severity: 'critical'
        });
      }
      nodeIds.add(node.id);

      // Validate node name
      if (!node.name || node.name.trim().length === 0) {
        node.name = `${node.type.split('.').pop() || 'Node'} ${index + 1}`;
        enhancements.push({
          type: 'node_description',
          applied: true,
          description: `Generated name for unnamed node: ${node.name}`,
          nodeId: node.id
        });
      }

      // Validate node type
      if (!node.type || typeof node.type !== 'string') {
        errors.push({
          type: 'missing_field',
          message: 'Node must have a valid type',
          nodeId: node.id,
          field: 'type',
          severity: 'critical'
        });
      }

      // Validate position
      if (!Array.isArray(node.position) || node.position.length !== 2) {
        node.position = [index * 250, 0]; // Auto-arrange horizontally
        enhancements.push({
          type: 'node_description',
          applied: true,
          description: `Generated position for node: ${node.name}`,
          nodeId: node.id
        });
      }

      // Ensure parameters object exists
      if (!node.parameters || typeof node.parameters !== 'object') {
        node.parameters = {};
      }

      // Add performance warnings for known resource-intensive nodes
      this.addNodePerformanceWarnings(node, warnings);

      // Add security warnings for credential-using nodes
      this.addNodeSecurityWarnings(node, warnings);
    });
  }

  /**
   * Validates workflow connections
   */
  private static validateConnections(
    workflow: N8nWorkflowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const nodeNames = new Set(workflow.nodes.map(n => n.name));
    
    Object.entries(workflow.connections || {}).forEach(([sourceNodeName, connections]) => {
      if (!nodeNames.has(sourceNodeName)) {
        errors.push({
          type: 'connection_error',
          message: `Connection references non-existent source node: ${sourceNodeName}`,
          severity: 'high'
        });
        return;
      }

      if (connections.main) {
        Object.entries(connections.main).forEach(([outputIndex, targets]) => {
          if (Array.isArray(targets)) {
            targets.forEach((target: any) => {
              if (!target.node || !nodeNames.has(target.node)) {
                errors.push({
                  type: 'connection_error',
                  message: `Connection references non-existent target node: ${target.node}`,
                  severity: 'high'
                });
              }
            });
          }
        });
      }
    });

    // Check for orphaned nodes
    const connectedNodes = new Set<string>();
    Object.values(workflow.connections || {}).forEach((connections: any) => {
      if (connections.main) {
        Object.values(connections.main).forEach((targets: any) => {
          if (Array.isArray(targets)) {
            targets.forEach((target: any) => {
              if (target.node) {
                connectedNodes.add(target.node);
              }
            });
          }
        });
      }
    });

    workflow.nodes.forEach(node => {
      if (!connectedNodes.has(node.name) && 
          workflow.nodes.length > 1 && 
          !this.isStartNode(node)) {
        warnings.push({
          type: 'maintainability',
          message: `Node "${node.name}" appears to be orphaned (not connected to other nodes)`,
          nodeId: node.id,
          suggestion: 'Consider connecting this node or removing it if unused'
        });
      }
    });
  }

  /**
   * Applies performance enhancements
   */
  private static applyPerformanceEnhancements(
    workflow: N8nWorkflowData,
    warnings: ValidationWarning[],
    enhancements: WorkflowEnhancement[]
  ): void {
    // Check for potentially inefficient patterns
    if (workflow.nodes.length > 10) {
      warnings.push({
        type: 'performance',
        message: 'Large workflow detected - consider breaking into smaller workflows',
        suggestion: 'Use sub-workflows or webhook triggers to split complex logic'
      });
    }

    // Add metadata for better performance
    if (!workflow.settings) {
      workflow.settings = {};
    }

    if (!workflow.settings.executionOrder) {
      workflow.settings.executionOrder = 'v1';
      enhancements.push({
        type: 'performance_optimization',
        applied: true,
        description: 'Set recommended execution order for better performance'
      });
    }
  }

  /**
   * Adds node-specific performance warnings
   */
  private static addNodePerformanceWarnings(node: N8nNode, warnings: ValidationWarning[]): void {
    const resourceIntensiveNodes = [
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.function',
      'n8n-nodes-base.code'
    ];

    if (resourceIntensiveNodes.some(type => node.type.includes(type))) {
      warnings.push({
        type: 'performance',
        message: `Node "${node.name}" may be resource intensive`,
        nodeId: node.id,
        suggestion: 'Consider adding appropriate timeouts and error handling'
      });
    }
  }

  /**
   * Adds node-specific security warnings
   */
  private static addNodeSecurityWarnings(node: N8nNode, warnings: ValidationWarning[]): void {
    const credentialNodes = [
      'slack', 'gmail', 'googleSheets', 'hubspot', 'airtable', 'stripe'
    ];

    if (credentialNodes.some(cred => node.type.includes(cred))) {
      warnings.push({
        type: 'security',
        message: `Node "${node.name}" requires credentials`,
        nodeId: node.id,
        suggestion: 'Ensure credentials are properly configured and secured'
      });
    }

    // Check for function nodes with potentially unsafe code
    if (node.type.includes('function') || node.type.includes('code')) {
      warnings.push({
        type: 'security',
        message: `Code node "${node.name}" requires security review`,
        nodeId: node.id,
        suggestion: 'Review code for security vulnerabilities and avoid exposing sensitive data'
      });
    }
  }

  /**
   * Adds general security recommendations
   */
  private static addSecurityRecommendations(
    workflow: N8nWorkflowData,
    warnings: ValidationWarning[]
  ): void {
    // Check if workflow processes external data
    const hasWebhook = workflow.nodes.some(n => n.type.includes('webhook'));
    const hasHttpRequest = workflow.nodes.some(n => n.type.includes('httpRequest'));

    if (hasWebhook) {
      warnings.push({
        type: 'security',
        message: 'Workflow accepts external webhook data',
        suggestion: 'Implement proper input validation and authentication'
      });
    }

    if (hasHttpRequest) {
      warnings.push({
        type: 'security',
        message: 'Workflow makes external HTTP requests',
        suggestion: 'Validate URLs and implement proper error handling'
      });
    }
  }

  /**
   * Checks if a node is a typical start node
   */
  private static isStartNode(node: N8nNode): boolean {
    const startNodeTypes = [
      'webhook', 'trigger', 'cron', 'schedule', 'start'
    ];
    
    return startNodeTypes.some(type => 
      node.type.toLowerCase().includes(type) || 
      node.name.toLowerCase().includes(type)
    );
  }

  /**
   * Quick validation check for basic workflow requirements
   */
  static isValidBasicWorkflow(workflow: any): boolean {
    return !!(
      workflow &&
      typeof workflow === 'object' &&
      workflow.name &&
      Array.isArray(workflow.nodes) &&
      workflow.nodes.length > 0 &&
      workflow.connections &&
      typeof workflow.connections === 'object'
    );
  }

  /**
   * Enhances workflow with missing metadata
   */
  static enhanceWorkflowMetadata(workflow: N8nWorkflowData): N8nWorkflowData {
    const enhanced = { ...workflow };
    
    if (!enhanced.tags) {
      enhanced.tags = ['AI Generated'];
    }
    
    if (!enhanced.createdAt) {
      enhanced.createdAt = new Date().toISOString();
    }
    
    if (!enhanced.updatedAt) {
      enhanced.updatedAt = new Date().toISOString();
    }
    
    if (!enhanced.settings) {
      enhanced.settings = {
        executionOrder: 'v1',
        saveManualExecutions: true,
        callerPolicy: 'workflowsFromSameOwner'
      };
    }
    
    return enhanced;
  }
} 