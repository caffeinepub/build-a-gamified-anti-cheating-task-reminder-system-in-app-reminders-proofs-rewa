import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import type { Task } from '../../backend';

interface TaskFiltersBarProps {
  filters: {
    status: string;
    priority: string;
    category: string;
  };
  onFiltersChange: (filters: any) => void;
  tasks: Task[];
}

export default function TaskFiltersBar({ filters, onFiltersChange, tasks }: TaskFiltersBarProps) {
  const categories = Array.from(new Set(tasks.map((t) => t.category))).filter(Boolean);

  return (
    <div className="game-panel p-4 flex flex-wrap gap-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground font-semibold">PRIORITY</Label>
        <Select
          value={filters.priority}
          onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}
        >
          <SelectTrigger className="w-32 bg-muted/50 border-border/50 hover:border-primary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="game-panel">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-semibold">CATEGORY</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger className="w-32 bg-muted/50 border-border/50 hover:border-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="game-panel">
              <SelectItem value="all">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
