'use client';

import { useState } from 'react';
import { TaskDetail, TaskPriority, TaskStatus, Comment } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { TaskActions } from './task-actions';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import CommentHeader from '../comment/comment-header';
import CommentContent from '../comment/comment-content';
import CommentInput from '../comment/comment-input';
import { commentService } from '@/services/comments';
import { useAuthStore } from '@/hooks/useAuthStore';
import { toast } from 'sonner';

interface TaskCardDetailProps {
  task: TaskDetail;
}

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  DONE: 'bg-green-100 text-green-800',
};

export function TaskCardDetail({ task }: TaskCardDetailProps) {
  const [localComments, setLocalComments] = useState<Comment[]>(task.comments);
  const { user, isAuthenticated } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleCommentSubmit = async (comment: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to comment');
      return;
    }

    // Create optimistic comment
    const optimisticComment: Comment = {
      id: Date.now().toString(),
      TaskId: task.id,
      UserId: user.id,
      comment,
      createdAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name || 'Unknown User',
      },
    };

    // Update UI immediately
    setLocalComments(prev => [optimisticComment, ...prev]);

    try {
      // Make API call
      const response = await commentService.add(task.id, comment);
      // Update the optimistic comment with the real one from the server
      setLocalComments(prev => 
        prev.map(c => c.id === optimisticComment.id ? { ...response.data, user: user } : c)
      );
    } catch (error) {
      // Revert on error
      setLocalComments(prev => prev.filter(c => c.id !== optimisticComment.id));
      toast.error('Failed to post comment');
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <Card className="divide-y">
        {/* Task Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <TaskActions task={task} />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className={statusColors[task.status]}>
              {task.status.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary" className={priorityColors[task.priority]}>
              {task.priority.toLowerCase()} priority
            </Badge>
          </div>

          {/* Task Description */}
          <p className="text-gray-700 whitespace-pre-wrap mb-6">
            {task.description}
          </p>

          {/* Task Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {task.assignedTo ? getInitials(task.assignedTo.name) : '??'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-medium">
                  {task.assignedTo?.name || 'Unassigned'}
                </p>
              </div>
            </div>

            {/* Creator */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {getInitials(task.createdBy.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-medium">{task.createdBy.name}</p>
              </div>
            </div>

            {/* Creation Date */}
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">
                {format(new Date(task.createdAt), 'PPP')}
              </p>
            </div>

            {/* Last Update */}
            <div>
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="font-medium">
                {format(new Date(task.updatedAt), 'PPP')}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          
          {/* Comment Input */}
          <div className="mb-6">
            <CommentInput 
              taskId={task.id}
              onSubmit={handleCommentSubmit}
            />
          </div>

          {/* Comments List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {localComments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <CommentHeader user={comment.user} createdAt={comment.createdAt} />
                  <CommentContent content={comment.comment} />
                  <Separator className="mt-4" />
                </div>
              ))}
              {localComments.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No comments yet
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
