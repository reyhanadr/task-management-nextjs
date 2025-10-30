// services/tasks.ts
import api from '@/lib/api';
import type { Task, TaskDetail, TaskStatus, TaskPriority } from '@/types/task';

export interface GetTasksParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  createdBy?: string;
  q?: string;
}

interface ListApiResponse<T> {
  data: {
    data: T;
    message?: string;
  };
}

interface SingleApiResponse<T> {
  data: T;
}

export const taskService = {
  /**
   * Fetch all tasks with optional filtering and pagination
   */
  getAll: (params?: GetTasksParams): Promise<ListApiResponse<Task[]>> => {
    return api.get('/tasks', { params });
  },

  /**
   * Fetch a single task by ID
   */
  getById: (id: string): Promise<SingleApiResponse<TaskDetail>> => {
    return api.get(`/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  create: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<SingleApiResponse<Task>> => {
    return api.post('/tasks', data);
  },

  /**
   * Update an existing task
   */
  update: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>): Promise<SingleApiResponse<Task>> => {
    return api.put(`/tasks/${id}`, data);
  },

  /**
   * Delete a task
   */
  delete: (id: string): Promise<{ data: { success: boolean; message?: string } }> => {
    return api.delete(`/tasks/${id}`);
  },

  /**
   * Assign a task to a user
   */
  assign: (taskId: string, userId: string): Promise<SingleApiResponse<Task>> => {
    return api.post(`/tasks/${taskId}/assign`, { userId });
  },

  /**
   * Update task status
   */
  updateStatus: (taskId: string, status: TaskStatus): Promise<SingleApiResponse<Task>> => {
    return api.put(`/tasks/${taskId}/status`, { status });
  },
};