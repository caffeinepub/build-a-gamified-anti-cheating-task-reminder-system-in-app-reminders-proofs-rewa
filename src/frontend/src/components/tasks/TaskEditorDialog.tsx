import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCreateTask, useUpdateTask } from '../../hooks/useQueries';
import type { Task } from '../../backend';
import { Priority } from '../../backend';
import { toast } from 'sonner';

interface TaskEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export default function TaskEditorDialog({ open, onOpenChange, task }: TaskEditorDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.medium);
  const [estimatedDuration, setEstimatedDuration] = useState('');

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category);
      setPriority(task.priority);
      setEstimatedDuration(task.estimatedDuration?.toString() || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority(Priority.medium);
      setEstimatedDuration('');
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData: Task = {
      id: task?.id || BigInt(0),
      title,
      description,
      category,
      priority,
      estimatedDuration: estimatedDuration ? BigInt(estimatedDuration) : undefined,
      recurrence: { __kind__: 'daily', daily: null },
      targetTimes: [BigInt(Date.now()) * BigInt(1_000_000)],
      gracePeriod: BigInt(60),
      creationTime: task?.creationTime || BigInt(Date.now()) * BigInt(1_000_000),
      dbBlobImage: task?.dbBlobImage,
    };

    try {
      if (task) {
        await updateTask.mutateAsync(taskData);
        toast.success('Task updated');
      } else {
        await createTask.mutateAsync(taskData);
        toast.success('Task created');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="game-panel max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {task ? 'Update your task details' : 'Add a new task to your quest log'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              className="bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your task"
              rows={3}
              className="bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Work, Health"
                required
                className="bg-muted/50 border-border/50 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="game-panel">
                  <SelectItem value={Priority.low}>Low</SelectItem>
                  <SelectItem value={Priority.medium}>Medium</SelectItem>
                  <SelectItem value={Priority.high}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-semibold">Estimated Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="30"
              min="1"
              className="bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createTask.isPending || updateTask.isPending}
              className="game-cta flex-1"
            >
              {createTask.isPending || updateTask.isPending ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:bg-muted/50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
