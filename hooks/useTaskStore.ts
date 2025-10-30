import { create } from 'zustand';
import type { Task } from '@/types/task';

interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === updatedTask.id ? updatedTask : t),
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
}));