'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import TaskEditModal from "./task-edit-modal";
import TaskDeleteModal from "./task-delete-modal";
import { useRouter } from "next/navigation";
import { type Task } from "@/types/task";
import { useTasksStore } from '@/hooks/useTaskStore';

interface TaskActionsProps {
  task: Task;
  onTaskUpdated?: () => void;
}

export function TaskActions({ task, onTaskUpdated }: TaskActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const { updateTask } = useTasksStore();

  const handleTaskUpdated = (updatedTask: Task) => {
    updateTask(updatedTask);
    onTaskUpdated?.();
    // window.location.reload();
  };

  const handleTaskDeleted = () => {
    onTaskUpdated?.();
    router.push("/dashboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-600"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onUpdated={handleTaskUpdated}
      />

      <TaskDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        taskId={task.id}
        taskTitle={task.title}
        onDeleted={handleTaskDeleted}
      />
    </>
  );
}
