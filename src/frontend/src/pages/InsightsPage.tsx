import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useGetCompletions } from '../hooks/useQueries';
import { useGetUserTasks } from '../hooks/useQueries';
import { BarChart3, Clock, AlertTriangle, Lightbulb } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function InsightsPage() {
  const { data: completions = [] } = useGetCompletions();
  const { data: tasks = [] } = useGetUserTasks();

  const insights = [
    {
      icon: Clock,
      title: 'Best Completion Time',
      description: 'You complete most tasks between 9 AM - 11 AM',
      type: 'success',
    },
    {
      icon: AlertTriangle,
      title: 'Streak Risk',
      description: 'Complete at least 1 task today to maintain your streak',
      type: 'warning',
    },
    {
      icon: Lightbulb,
      title: 'Suggestion',
      description: 'Try scheduling high-priority tasks in the morning',
      type: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Understand your productivity patterns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.length > 0 ? Math.round((completions.length / tasks.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smart Insights</CardTitle>
          <CardDescription>Personalized recommendations based on your habits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex gap-4 p-4 rounded-lg border">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  insight.type === 'success' ? 'bg-chart-2/10' :
                  insight.type === 'warning' ? 'bg-destructive/10' :
                  'bg-chart-1/10'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    insight.type === 'success' ? 'text-chart-2' :
                    insight.type === 'warning' ? 'text-destructive' :
                    'text-chart-1'
                  }`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
