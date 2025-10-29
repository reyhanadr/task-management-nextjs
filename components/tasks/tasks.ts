// types/task.ts
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  comment: string;
  user: User;
  createdAt: string;
  taskId: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  comment: string;
  user: User;
  createdAt: string;
}