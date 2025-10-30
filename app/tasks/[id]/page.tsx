import TaskDetailClient from '../task-detail-client';

// interface TaskPageProps {
//   params: {
//     id: string;
//   };
// }

export default async function TaskDetailPage({ 
  params 
}:{
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  if (!id) {
    throw new Error('Task ID is required');
  }

  return <TaskDetailClient taskId={id} />;
}