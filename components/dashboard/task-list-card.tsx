"use client";

import { Task, TaskStatus, TaskPriority } from "@/components/tasks/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";

interface TaskListCardProps {
  tasks: Task[];
  title: string;
  emptyMessage?: string;
  className?: string;
}

const statusVariant: Record<TaskStatus, string> = {
  TODO: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  DONE: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
};

const priorityVariant: Record<TaskPriority, string> = {
  LOW: "bg-gray-50 text-gray-700 hover:bg-gray-100",
  MEDIUM: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  HIGH: "bg-red-50 text-red-700 hover:bg-red-100",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
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

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export function TaskListCard({
  tasks,
  title,
  emptyMessage = "Tidak ada tugas ditemukan",
  className,
}: TaskListCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className={cn(
        "h-full flex flex-col shadow-sm border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm",
        className
      )}>
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800 tracking-tight">
              {title}
            </CardTitle>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge 
                variant="secondary" 
                className="rounded-full px-3 py-1 bg-white/80 border-gray-200 text-gray-600 font-medium shadow-sm"
              >
                {tasks.length}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto px-6 pb-6">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center text-muted-foreground py-12"
            >
              <div className="text-lg mb-2">📝</div>
              <div className="font-medium">{emptyMessage}</div>
            </motion.div>
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <Link href={`/tasks/${task.id}`} className="block">
                    <motion.div
                      variants={cardHoverVariants}
                      className="group p-5 border border-gray-100 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {task.title}
                          </h4>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 flex-wrap">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium px-3 py-1 rounded-full border transition-all duration-200",
                                  statusVariant[task.status]
                                )}
                              >
                                {task.status.replace("_", " ")}
                              </Badge>
                            </motion.div>
                            
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                className={cn(
                                  "text-xs font-medium px-3 py-1 rounded-full",
                                  priorityVariant[task.priority]
                                )}
                              >
                                {task.priority.toLowerCase()}
                              </Badge>
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 text-xs text-gray-500 shrink-0">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">{formatDate(task.updatedAt)}</span>
                          </div>
                          {task.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span className="font-medium text-gray-700">{task.assignedTo.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
