// components/task/task-card.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/task";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />;
      default:
        return <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />;
    }
  };


  return (
    <>
    <Link href={`/tasks/${task.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              {getStatusIcon(task.status)}
              <CardTitle className="text-base font-medium">{task.title}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="line-clamp-2 text-sm">
            {task.description || 'Tidak ada deskripsi'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority === 'HIGH' ? 'Tinggi' : task.priority === 'MEDIUM' ? 'Sedang' : 'Rendah'}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span suppressHydrationWarning>{formatDistanceToNow(new Date(task.createdAt), { 
                  addSuffix: true, 
                  locale: id 
                })}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageSquare className="h-4 w-4" />
              </Button>
              {task.assignedTo && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback>
                    {task.assignedTo.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
    </>
  );
}