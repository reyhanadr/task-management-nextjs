
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRouter } from 'next/navigation';
import { TaskCard } from '@/components/task-card';
import { taskService } from '@/services/tasks';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { getSocket } from '@/lib/socket';
import { useTasksStore } from '@/hooks/useTaskStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { TaskAddModal } from '@/components/task/task-add-modal';
import { Plus } from 'lucide-react';
import type { GetTasksParams } from '@/services/tasks';

export default function DashboardPage() {
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const router = useRouter();
  const { tasks, addTask, updateTask, removeTask, setTasks } = useTasksStore();
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();

    const handleTaskCreated = (task: Task) => {
      addTask(task);
    };

    const handleTaskUpdated = (updatedTask: Task) => {
      updateTask(updatedTask);
    };

    const handleTaskDeleted = (taskId: string) => {
      removeTask(taskId);
    };

    socket.on('task.created', handleTaskCreated);
    socket.on('task.updated', handleTaskUpdated);
    socket.on('task.deleted', handleTaskDeleted);

    return () => {
      socket.off('task.created', handleTaskCreated);
      socket.off('task.updated', handleTaskUpdated);
      socket.off('task.deleted', handleTaskDeleted);
    };
  }, [isAuthenticated, addTask, updateTask, removeTask]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params: GetTasksParams = {};
        if (statusFilter !== 'ALL') params.status = statusFilter;
        if (priorityFilter !== 'ALL') params.priority = priorityFilter;
        
        const response = await taskService.getAll(params);
        setTasks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user, statusFilter, priorityFilter, setTasks]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleTaskAdded = () => {
    // This will be called when a new task is added
    // You can add any additional logic here, like refreshing the task list
    console.log('New task was added!');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-gray-600">Manage your tasks efficiently</p>
          </div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as TaskStatus | 'ALL')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'ALL')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="ALL">All Priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
                      <TaskAddModal onTaskAdded={handleTaskAdded}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </TaskAddModal>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No tasks found</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}