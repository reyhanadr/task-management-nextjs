'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { format } from 'date-fns';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
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

export function TaskCard({ task }: TaskCardProps) {
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Link href={`/tasks/${task.id}`}>
        <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-1">{task.title}</h3>
            <Badge variant="secondary" className={priorityColors[task.priority]}>
                {task.priority.toLowerCase()}
            </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

            {/* Status */}
            <Badge className={statusColors[task.status]}>
            {task.status.replace('_', ' ')}
            </Badge>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                <AvatarFallback>
                    {task.assignedTo ? getInitials(task.assignedTo.name) : '??'}
                </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                <p className="text-gray-600">Assigned to:</p>
                <p className="font-medium">{task.assignedTo?.name || 'Unassigned'}</p>
                </div>
            </div>
            <div className="text-right text-sm text-gray-500">
                <p>{task.createdAt ? format(new Date(task.createdAt), 'MMM dd, yyyy') : 'N/A'}</p>
                <p>Last updated: {task.updatedAt ? format(new Date(task.updatedAt), 'MMM dd, yyyy') : 'N/A'}</p>
            </div>
            </div>
        </div>
        </Card>
    </Link>

  );
}
