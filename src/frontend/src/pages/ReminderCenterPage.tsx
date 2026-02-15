import { useGetReminders } from '../hooks/useQueries';
import { useGetUserTasks } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, Clock } from 'lucide-react';
import { useMemo } from 'react';

export default function ReminderCenterPage() {
  const { data: reminders = [] } = useGetReminders();
  const { data: tasks = [] } = useGetUserTasks();

  const remindersByStatus = useMemo(() => {
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    
    const active = reminders.filter((r) => r.scheduledTime <= now);
    const upcoming = reminders.filter((r) => r.scheduledTime > now);

    return { active, upcoming };
  }, [reminders]);

  const getTaskForReminder = (taskId: bigint) => {
    return tasks.find((t) => t.id === taskId);
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reminder Center</h1>
        <p className="text-muted-foreground">Stay on top of your scheduled tasks</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-chart-2" />
              Active Reminders
            </CardTitle>
            <CardDescription>Tasks that need your attention now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {remindersByStatus.active.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No active reminders</p>
            ) : (
              remindersByStatus.active.map((reminder) => {
                const task = getTaskForReminder(reminder.taskId);
                return (
                  <div key={reminder.id.toString()} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{task?.title || 'Unknown Task'}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(reminder.scheduledTime)}</p>
                      </div>
                      {reminder.isRereminder && (
                        <Badge variant="destructive" className="text-xs">Re-reminder</Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-chart-1" />
              Upcoming Reminders
            </CardTitle>
            <CardDescription>Scheduled for later</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {remindersByStatus.upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming reminders</p>
            ) : (
              remindersByStatus.upcoming.slice(0, 5).map((reminder) => {
                const task = getTaskForReminder(reminder.taskId);
                return (
                  <div key={reminder.id.toString()} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{task?.title || 'Unknown Task'}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(reminder.scheduledTime)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
