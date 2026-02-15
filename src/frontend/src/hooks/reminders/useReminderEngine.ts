import { useEffect, useRef, useState } from 'react';
import { useGetReminders } from '../useQueries';
import { useGetUserTasks } from '../useQueries';
import { useCurrentUser } from '../useCurrentUser';
import type { Reminder, Task } from '../../backend';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const POLL_INTERVAL = 30000; // 30 seconds
const RE_REMINDER_INTERVALS = [5, 10, 15, 30]; // minutes

export function useReminderEngine() {
  const { isAuthenticated } = useCurrentUser();
  const { data: reminders = [] } = useGetReminders();
  const { data: tasks = [] } = useGetUserTasks();
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkReminders = () => {
      const now = Date.now();
      const nowNano = BigInt(now) * BigInt(1_000_000);

      reminders.forEach((reminder) => {
        const reminderKey = `${reminder.taskId}-${reminder.scheduledTime}`;
        
        if (dismissedReminders.has(reminderKey)) return;
        
        if (reminder.scheduledTime <= nowNano) {
          const task = tasks.find((t) => t.id === reminder.taskId);
          if (!task) return;

          toast(`⏰ Reminder: ${task.title}`, {
            description: task.description || 'Time to complete this task!',
            duration: 10000,
            action: {
              label: 'View Task',
              onClick: () => navigate({ to: '/tasks' }),
            },
          });

          setDismissedReminders((prev) => new Set(prev).add(reminderKey));
        }
      });
    };

    checkReminders();
    timerRef.current = setInterval(checkReminders, POLL_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAuthenticated, reminders, tasks, dismissedReminders, navigate]);

  return null;
}
