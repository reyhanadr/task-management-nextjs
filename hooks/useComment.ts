import { useState, useEffect, useCallback } from 'react';
import { commentService } from '@/services/comments';
import { getSocket } from '@/lib/socket';

interface Comment {
  id: string;
  taskId: string;
  comment: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface UseCommentOptions {
  taskId: string;
}

export const useComment = ({ taskId }: UseCommentOptions) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await commentService.getAll(taskId);
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  const addComment = useCallback(async (comment: string) => {
    try {
      const response = await commentService.add(taskId, comment);
      setComments(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();

    // Set up WebSocket listeners for real-time updates
    const socket = getSocket();

    socket.on(`comments:created:${taskId}`, (newComment: Comment) => {
      setComments(prev => [...prev, newComment]);
    });

    socket.on(`comments:updated:${taskId}`, (updatedComment: Comment) => {
      setComments(prev => 
        prev.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    });

    socket.on(`comments:deleted:${taskId}`, (deletedCommentId: string) => {
      setComments(prev => prev.filter(comment => comment.id !== deletedCommentId));
    });

    return () => {
      socket.off(`comments:created:${taskId}`);
      socket.off(`comments:updated:${taskId}`);
      socket.off(`comments:deleted:${taskId}`);
    };
  }, [taskId, fetchComments]);

  return {
    comments,
    loading,
    error,
    addComment,
    refetch: fetchComments,
  };
};
