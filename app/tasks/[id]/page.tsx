"use client";

import { useTasks } from "@/hooks/useTasks";
import { TaskDetails } from "@/components/tasks/tasks-detail";
import { notFound } from "next/navigation";
import { TaskDetailSkeleton } from "./task-detail-skeleton";
import { useAuthStore, useHydrateAuthFromStorage } from "@/hooks/useAuthStore";
import { redirect } from "next/navigation";

export default function DetailTaskPage({ params }: { params: { id: string } }) {
  const { tasks, error, loading } = useTasks();

  useHydrateAuthFromStorage({
    onHydrated: () => {
      if (!useAuthStore.getState().token) {
        redirect("/login");
      }
    }
  })

  if (loading) {
    return <TaskDetailSkeleton />;
  }

  if (error) {
    throw error; 
  }
  
  const task = tasks.find((t) => t.id === params.id);
  
  if (!task) {
    notFound(); 
  }
  
  return <TaskDetails task={task} />;
}