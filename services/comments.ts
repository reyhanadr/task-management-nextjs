// services/comments.ts
import api from '@/lib/api';

export const commentService = {
  add: (taskId: string, comment: string) =>
    api.post(`/tasks/${taskId}/comments`, { comment }),

  getAll: (taskId: string) =>
    api.get(`/tasks/${taskId}/comments`),
};