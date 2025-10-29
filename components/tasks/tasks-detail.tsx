"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskComments } from "./tasks-comment";
import { EditTaskModal } from "./edit-tasks-modal";
import { Task } from "./tasks";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  User,
  Flag,
  CheckCircle,
  Loader2,
  Edit,
  Trash,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

interface TaskDetailsProps {
  task: Task;
}

const priorityColors = {
  LOW: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  HIGH: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
};

const statusColors = {
  TODO: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  DONE: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const router = useRouter();
  const { deleteTask, refetch } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    
    try {
      setIsDeleting(true);
      await deleteTask(task.id as string);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-6 p-4"
    >
      {/* Back Button */}
      <motion.div variants={cardVariants}>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </motion.div>

      {/* Main Task Card */}
      <motion.div variants={cardVariants}>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-3 flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-900 leading-tight"
                >
                  {task.title}
                </motion.h1>
                {task.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-lg leading-relaxed"
                  >
                    {task.description}
                  </motion.p>
                )}
              </div>
              <div className="flex gap-3">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-10 w-10 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-10 w-10"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Edit Task Modal */}
      {task && (
        <EditTaskModal
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Task Information Cards */}
      <motion.div variants={cardVariants}>
        <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Informasi Tugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dibuat</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2 bg-green-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Diupdate</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(task.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2 bg-purple-50 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dibuat oleh</p>
                  <p className="text-sm font-semibold text-gray-900">{task.createdBy.name}</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Flag className="h-5 w-5 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status & Prioritas</p>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium px-2 py-1 ${statusColors[task.status]}`}
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium px-2 py-1 ${priorityColors[task.priority]}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Section */}
      <motion.div variants={cardVariants}>
        <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="comments" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="comments" className="text-sm font-medium">Komentar</TabsTrigger>
                <TabsTrigger value="activity" className="text-sm font-medium">Aktivitas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comments" className="mt-6">
                <TaskComments taskId={task.id} />
              </TabsContent>
              
              <TabsContent value="activity" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Log Aktivitas</h3>
                  <p className="text-muted-foreground">
                    Fitur log aktivitas akan segera hadir...
                  </p>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
