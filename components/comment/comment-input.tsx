'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from '@/hooks/useAuthStore';
import { Comment } from '@/types/task';

interface CommentInputProps {
  taskId: string;
  onSubmit: (comment: string) => Promise<void>;
}

export default function CommentInput({ taskId, onSubmit }: CommentInputProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmit = async () => {
    if (!comment.trim() || !isAuthenticated) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(comment);
      setComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Please login to comment
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4">
      <Avatar className="h-10 w-10">
        <AvatarFallback>
          {user.name ? getInitials(user.name) : '??'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          className="min-h-[100px] p-3"
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !comment.trim()}
          className="mt-2"
        >
          {isSubmitting ? 'Posting...' : 'Comment'}
        </Button>
      </div>
    </div>
  );
}
