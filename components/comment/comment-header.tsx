'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface CommentHeaderProps {
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function CommentHeader({ user, createdAt }: CommentHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center space-x-2">
        <span className="font-medium">{user.name}</span>
        <span className="text-gray-500">•</span>
        <span className="text-sm text-gray-500">
          {format(new Date(createdAt), 'PP')}
        </span>
      </div>
    </div>
  );
}
