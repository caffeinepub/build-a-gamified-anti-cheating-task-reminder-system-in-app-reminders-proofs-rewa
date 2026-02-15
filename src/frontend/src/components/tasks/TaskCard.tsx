import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import type { Task } from '../../backend';
import { useDeleteTask } from '../../hooks/useQueries';
import TaskEditorDialog from './TaskEditorDialog';
import CompleteTaskFlowDialog from '../completions/CompleteTaskFlowDialog';
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const deleteTask = useDeleteTask();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(task.id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <>
      <div className="task-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              {task.dbBlobImage && (
                <img
                  src={task.dbBlobImage.getDirectURL()}
                  alt={task.title}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-border/50"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`game-chip ${
                task.priority === 'high' ? 'game-chip-warning' : 
                task.priority === 'medium' ? 'game-chip-primary' : 
                'game-chip'
              }`}>
                {task.priority.toUpperCase()}
              </span>
              <span className="game-chip">{task.category}</span>
              {task.estimatedDuration && (
                <span className="game-chip">
                  <Clock className="h-3 w-3" />
                  {task.estimatedDuration.toString()} min
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => setCompleteDialogOpen(true)}
              className="game-cta gap-1 text-sm px-4 py-2"
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </Button>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setEditorOpen(true)}
                className="hover:bg-primary/20 hover:border-primary/50"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={deleteTask.isPending}
                className="hover:bg-destructive/20 hover:border-destructive/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TaskEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        task={task}
      />

      <CompleteTaskFlowDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        task={task}
      />
    </>
  );
}
