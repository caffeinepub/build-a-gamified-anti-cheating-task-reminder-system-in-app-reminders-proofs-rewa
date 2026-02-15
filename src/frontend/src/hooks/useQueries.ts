import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Task, TaskId, Completion, Reward, Reminder, UserProfile } from '../backend';

export function useGetUserTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['userTasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserTask(taskId: TaskId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Task | null>({
    queryKey: ['userTask', taskId?.toString()],
    queryFn: async () => {
      if (!actor || !taskId) return null;
      return actor.getUserTask(taskId);
    },
    enabled: !!actor && !isFetching && taskId !== null,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
      queryClient.invalidateQueries({ queryKey: ['userTask'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: TaskId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
    },
  });
}

export function useAddTaskImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, image }: { taskId: TaskId; image: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTaskImage(taskId, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
      queryClient.invalidateQueries({ queryKey: ['userTask'] });
    },
  });
}

export function useGetCompletions() {
  const { actor, isFetching } = useActor();

  return useQuery<Completion[]>({
    queryKey: ['completions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCompletions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCompletion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (completion: Completion) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCompletion(completion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completions'] });
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['rewardHistory'] });
    },
  });
}

export function useGetRewardHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward[]>({
    queryKey: ['rewardHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRewardHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: Reward) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReward(reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewardHistory'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetReminders() {
  const { actor, isFetching } = useActor();

  return useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReminders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminder: Reminder) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReminder(reminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useInitializeUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeUser(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
