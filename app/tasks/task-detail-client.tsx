'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TaskCardDetail } from '@/components/task/task-card';
import { taskService } from '@/services/tasks';
import type { Task, TaskDetail } from '@/types/task';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useTasksStore } from '@/hooks/useTaskStore';

interface TaskDetailClientProps {
  taskId: string;
}

type TaskDetailState = {
  loading: boolean;
  error: string | null;
};

export default function TaskDetailClient({ taskId }: TaskDetailClientProps) {
  const [state, setState] = useState<TaskDetailState>({
    loading: true,
    error: null,
  });
  
  const router = useRouter();
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const { tasks, setTasks } = useTasksStore();
  
  const currentTask = tasks.find(t => t.id === taskId) as TaskDetail | undefined;

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  const fetchTask = useCallback(async () => {
    if (!taskId) {
      setState(prev => ({ ...prev, 
        error: 'Task ID is required',
        loading: false 
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const response = await taskService.getById(taskId);
      const taskWithComments = response.data;
      
      // Update the task in the store
      setTasks([taskWithComments]);
      
      setState(prev => ({ ...prev, error: null }));
      return taskWithComments;
    } catch (err) {
      const errorMessage = 'Failed to load task. The task might have been deleted or you might not have permission to view it.';
      console.error('Error fetching task:', err);
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [taskId]);

  // Initial fetch on component mount and when taskId changes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const controller = new AbortController();
    let isMounted = true;

    const loadTask = async () => {
      const task = await fetchTask();
      if (!isMounted) return;
      
      if (!task) {
        // If task is not found, redirect to dashboard after a delay
        setTimeout(() => {
          if (isMounted) router.push('/dashboard');
        }, 3000);
      }
    };

    loadTask();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isAuthenticated, taskId, fetchTask, router]);

  // Show loading state
  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (state.error || !currentTask) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error || 'Task not found'}</span>
          <button
            onClick={() => router.push('/dashboard')}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Close error message"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render the task detail view
  return <TaskCardDetail task={currentTask} />;
}