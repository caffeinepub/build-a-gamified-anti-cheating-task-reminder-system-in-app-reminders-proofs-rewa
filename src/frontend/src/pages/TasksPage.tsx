import { useState } from 'react';
import { useGetUserTasks } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Plus } from 'lucide-react';
import TaskEditorDialog from '../components/tasks/TaskEditorDialog';
import TaskCard from '../components/tasks/TaskCard';
import TaskFiltersBar from '../components/tasks/TaskFiltersBar';

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useGetUserTasks();
  const [editorOpen, setEditorOpen] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all' });

  const filteredTasks = tasks.filter((task) => {
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="game-panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Tasks
            </h1>
            <p className="text-muted-foreground mt-1">Manage your daily goals and activities</p>
          </div>
          <Button onClick={() => setEditorOpen(true)} className="game-cta gap-2">
            <Plus className="h-5 w-5" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TaskFiltersBar filters={filters} onFiltersChange={setFilters} tasks={tasks} />

      {/* Task List */}
      {isLoading ? (
        <div className="game-panel p-12 text-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="game-panel">
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
            <Button onClick={() => setEditorOpen(true)} className="game-cta">
              Create Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id.toString()} task={task} />
          ))}
        </div>
      )}

      <TaskEditorDialog open={editorOpen} onOpenChange={setEditorOpen} />
    </div>
  );
}
