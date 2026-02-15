import { useGetCompletions } from '../hooks/useQueries';
import { useGetUserTasks } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { History, CheckCircle } from 'lucide-react';

export default function HistoryPage() {
  const { data: completions = [] } = useGetCompletions();
  const { data: tasks = [] } = useGetUserTasks();

  const getTaskTitle = (taskId: bigint) => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.title || 'Unknown Task';
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const getProofTypeLabel = (proof: any) => {
    if ('textNote' in proof) return 'Text Note';
    if ('checklistConfirmation' in proof) return 'Checklist';
    if ('timedSessionLog' in proof) return `Timed Session (${proof.timedSessionLog} min)`;
    if ('photoUpload' in proof) return 'Photo';
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-muted-foreground">Review your completed tasks and rewards</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Completion History
          </CardTitle>
          <CardDescription>All your completed tasks with proof and reflections</CardDescription>
        </CardHeader>
        <CardContent>
          {completions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No completions yet. Start completing tasks to build your history!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completions.slice().reverse().map((completion, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{getTaskTitle(completion.taskId)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(completion.completionTime)}
                      </p>
                    </div>
                    <Badge variant="secondary">{getProofTypeLabel(completion.proof)}</Badge>
                  </div>
                  {completion.reflection && (
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Reflection:</p>
                      <p className="italic">{completion.reflection}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
