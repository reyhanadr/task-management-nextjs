import { useState, useEffect, useCallback } from 'react';
import { taskService } from '@/services/tasks';
import { getSocket } from '@/lib/socket';
import type { Task, TaskStatus, TaskPriority } from '@/components/tasks/tasks';

interface UseTasksOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  createdBy?: string;
}

export const useTasks = (options: UseTasksOptions = {}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await taskService.getAll({
        status: options.status,
        priority: options.priority,
        assignedTo: options.assignedTo,
        createdBy: options.createdBy,
      });
      setTasks(data.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
    } finally {
      setLoading(false);
    }
  }, [options.status, options.priority, options.assignedTo, options.createdBy]);

  useEffect(() => {
    fetchTasks();

    // Set up WebSocket listeners for real-time updates
    const socket = getSocket();
    
    const handleTaskCreated = (task: Task) => {
      setTasks(prev => [task, ...prev]);
    };

    const handleTaskUpdated = (task: Task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    };

    const handleTaskDeleted = ({ id }: { id: string }) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    };

    socket.on('task.created', handleTaskCreated);
    socket.on('task.updated', handleTaskUpdated);
    socket.on('task.deleted', handleTaskDeleted);

    return () => {
      socket.off('task.created', handleTaskCreated);
      socket.off('task.updated', handleTaskUpdated);
      socket.off('task.deleted', handleTaskDeleted);
    };
  }, [fetchTasks]);

  // Helper functions for task manipulation
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      const { data } = await taskService.create(taskData);
      return data.data;
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      // Optimistically update the local state first
      const taskToUpdate = tasks.find(t => t.id === id);
      if (taskToUpdate) {
        const optimisticTask = {
          ...taskToUpdate,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        // Update local state immediately
        setTasks(prev => prev.map(t => 
          t.id === id ? optimisticTask : t
        ));
      }

      // Make the actual API call
      const { data } = await taskService.update(id, updates);
      
      // Update with the server response data
      setTasks(prev => prev.map(t => 
        t.id === id ? data.data : t
      ));
      
      return data.data;
    } catch (err) {
      // Revert the optimistic update on error
      const originalTask = tasks.find(t => t.id === id);
      if (originalTask) {
        setTasks(prev => prev.map(t => 
          t.id === id ? originalTask : t
        ));
      }
      console.error('Failed to update task:', err);
      throw err;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.delete(id);
      return true;
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
};