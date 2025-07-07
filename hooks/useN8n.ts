import { useState, useEffect, useCallback, useRef } from 'react';
import { n8nService, N8nConnection, N8nWorkflow, N8nExecution } from '../services/n8nService';

export const useN8n = () => {
  const [connections, setConnections] = useState<N8nConnection[]>([]);
  const [activeConnection, setActiveConnection] = useState<N8nConnection | null>(null);
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [executions, setExecutions] = useState<N8nExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const loadingRef = useRef(false);

  // Set active connection when connections change
  useEffect(() => {
    const active = connections.find(conn => conn.is_active);
    setActiveConnection(active || null);
  }, [connections]);



  // Load connections only once on mount
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      loadConnections();
    }
  }, []);

  const loadConnections = useCallback(async (forceReload = false) => {
    // Prevent multiple simultaneous loads unless forced
    if (loadingRef.current && !forceReload) return;
    if (connections.length > 0 && !forceReload) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      const response = await n8nService.getConnections();
      if (response.success) {
        setConnections(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connections');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [connections.length]);

  const testConnection = useCallback(async (baseUrl: string, apiKey: string, instanceName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await n8nService.testConnection(baseUrl, apiKey, instanceName);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConnection = useCallback(async (baseUrl: string, apiKey: string, instanceName: string, workflowCount?: number, version?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await n8nService.saveConnection(baseUrl, apiKey, instanceName, workflowCount, version);
      if (response.success) {
        await loadConnections(true); // Force reload connections
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save connection';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadConnections]);

  const deleteConnection = useCallback(async (connectionId: string) => {
    try {
      setLoading(true);
      setError(null);
      await n8nService.deleteConnection(connectionId);
      await loadConnections(true); // Force reload connections
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete connection';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadConnections]);

  const loadWorkflows = useCallback(async (forceReload = false) => {
    if (!activeConnection) {
      return;
    }
    
    // Prevent multiple simultaneous loads unless forced
    if (loadingRef.current && !forceReload) {
      return;
    }
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      const workflowData = await n8nService.getWorkflows();
      setWorkflows(workflowData);
    } catch (err) {
      console.error('Failed to load workflows:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [activeConnection]);

  // Load workflows when active connection is set
  useEffect(() => {
    if (activeConnection) {
      loadWorkflows();
    }
  }, [activeConnection, loadWorkflows]);

  const createWorkflow = useCallback(async (workflow: any) => {
    try {
      setLoading(true);
      setError(null);
      const newWorkflow = await n8nService.createWorkflow(workflow);
      await loadWorkflows(true); // Force reload workflows
      return newWorkflow;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workflow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadWorkflows]);

  const updateWorkflow = useCallback(async (workflowId: string, workflow: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedWorkflow = await n8nService.updateWorkflow(workflowId, workflow);
      await loadWorkflows(true); // Force reload workflows
      return updatedWorkflow;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update workflow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadWorkflows]);

  const deleteWorkflow = useCallback(async (workflowId: string) => {
    try {
      setLoading(true);
      setError(null);
      await n8nService.deleteWorkflow(workflowId);
      await loadWorkflows(true); // Force reload workflows
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete workflow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadWorkflows]);

  const activateWorkflow = useCallback(async (workflowId: string) => {
    try {
      setLoading(true);
      setError(null);
      await n8nService.activateWorkflow(workflowId);
      await loadWorkflows(true); // Force reload workflows
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate workflow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadWorkflows]);

  const deactivateWorkflow = useCallback(async (workflowId: string) => {
    try {
      setLoading(true);
      setError(null);
      await n8nService.deactivateWorkflow(workflowId);
      await loadWorkflows(true); // Force reload workflows
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate workflow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadWorkflows]);

  const executeWorkflow = useCallback(async (workflowId: string, data: any = {}) => {
    try {
      setLoading(true);
      setError(null);
      const execution = await n8nService.executeWorkflow(workflowId, data);
      return execution;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute workflow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadExecutions = useCallback(async (workflowId?: string, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      const executionData = await n8nService.getExecutions(workflowId, limit);
      setExecutions(executionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load executions');
    } finally {
      setLoading(false);
    }
  }, []);

  const healthCheck = useCallback(async () => {
    try {
      return await n8nService.healthCheck();
    } catch (err) {
      return { status: 'error', message: err instanceof Error ? err.message : 'Health check failed' };
    }
  }, []);

  return {
    // State
    connections,
    activeConnection,
    workflows,
    executions,
    loading,
    error,
    initialized,

    // Connection methods
    testConnection,
    saveConnection,
    deleteConnection,
    loadConnections,

    // Workflow methods
    loadWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    activateWorkflow,
    deactivateWorkflow,
    executeWorkflow,

    // Execution methods
    loadExecutions,

    // Utility methods
    healthCheck,
  };
};