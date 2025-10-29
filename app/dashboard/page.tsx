"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useHydrateAuthFromStorage } from "@/hooks/useAuthStore";
import { TaskListCard } from "@/components/dashboard/task-list-card";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { DashboardLoadingSkeleton } from "@/components/dashboard/dashboard-loading-skeleton";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { CreateTaskModal } from "@/components/tasks/create-tasks-modal";

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Hydrate auth state from localStorage and get hydration status
  const isHydrated = useHydrateAuthFromStorage({
    onHydrated: () => {
      // Check token immediately after hydration
      const token = useAuthStore.getState().token;
      if (!token) {
        router.replace("/login");
      }
    }
  });

  // Fetch tasks with the useTasks hook
  const { tasks, loading, error } = useTasks(
    isHydrated ? {  
      // You can add filters here like:
      // status: 'TODO',
      // priority: 'HIGH',
      // assignedTo: 'user-id',
    } : undefined // Don't fetch until hydrated
  );

  useEffect(() => {
    // Only check auth after hydration is complete
    if (isHydrated && !token) {
      router.push("/login");
    }
  }, [isHydrated, token, router]);

  if (!token) {
    return (
      <div className="min-h-[80vh] grid place-items-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirecting to login...</span>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return <DashboardError error={error} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {`Selamat datang kembali! Berikut adalah apa yang terjadi dengan tugas Anda.`}
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* All Tasks */}
        <div className="md:col-span-3">
          <TaskListCard
            tasks={tasks}
            title="All Tasks"
            emptyMessage="No tasks found. Create your first task to get started!"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}