
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface UserTaskResponse {
  id: string;
  name: string;
  email: string;
}

interface UserCommentResponse{
  id: string;
  name: string;
}

export interface Comment{
  id: string;
  TaskId: string;
  UserId: string;
  comment: string;
  createdAt: string;
  user: UserCommentResponse;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: UserTaskResponse | null;
  createdBy: UserTaskResponse;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetail {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo: UserTaskResponse | null;
    createdBy: UserTaskResponse;
    createdAt: string;
    updatedAt: string;
    comments: Comment[];
}
