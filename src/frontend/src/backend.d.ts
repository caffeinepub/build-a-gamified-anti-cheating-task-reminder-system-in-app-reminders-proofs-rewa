import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type URL = string;
export type Level = bigint;
export type Timestamp = bigint;
export interface Reward {
    levelUp: boolean;
    badges: Array<Badge>;
    streakBonus: boolean;
    coinsGained: Coins;
    xpGained: XP;
}
export type ReminderId = bigint;
export interface Task {
    id: TaskId;
    title: string;
    gracePeriod: bigint;
    description: string;
    recurrence: Recurrence;
    creationTime: Timestamp;
    targetTimes: Array<Timestamp>;
    category: string;
    estimatedDuration?: bigint;
    priority: Priority;
    dbBlobImage?: ExternalBlob;
}
export type Coins = bigint;
export type Badge = string;
export type ProofType = {
    __kind__: "textNote";
    textNote: string;
} | {
    __kind__: "checklistConfirmation";
    checklistConfirmation: Array<boolean>;
} | {
    __kind__: "timedSessionLog";
    timedSessionLog: bigint;
} | {
    __kind__: "photoUpload";
    photoUpload: URL;
};
export type Recurrence = {
    __kind__: "custom";
    custom: Array<Timestamp>;
} | {
    __kind__: "daily";
    daily: null;
} | {
    __kind__: "weekly";
    weekly: Array<boolean>;
};
export interface Reminder {
    id: ReminderId;
    scheduledTime: Timestamp;
    taskId: TaskId;
    isRereminder: boolean;
}
export interface Completion {
    completionTime: Timestamp;
    taskId: TaskId;
    proof: ProofType;
    reflection: string;
}
export type XP = bigint;
export type TaskId = bigint;
export type Image = Uint8Array;
export interface UserProfile {
    displayName: string;
    totalXP: XP;
    coins: Coins;
    badges: Array<Badge>;
    level: Level;
    avatarUrl?: ExternalBlob;
    streakCount: bigint;
}
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCompletion(completion: Completion): Promise<void>;
    addReminder(reminder: Reminder): Promise<void>;
    addReward(reward: Reward): Promise<void>;
    addTaskImage(taskId: TaskId, image: Image): Promise<void>;
    adminGetUserProfile(user: Principal): Promise<UserProfile | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTask(task: Task): Promise<TaskId>;
    deleteTask(taskId: TaskId): Promise<void>;
    getAverageCompletionTime(startTime: bigint, endTime: bigint): Promise<{
        avgTime: number;
        nTasks: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletions(): Promise<Array<Completion>>;
    getReminders(): Promise<Array<Reminder>>;
    getRewardHistory(): Promise<Array<Reward>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStatsByLevel(minLevel: Level, maxLevel: Level): Promise<{
        XP: XP;
        started: bigint;
        completed: bigint;
        Coins: Coins;
        inProgress: bigint;
        failed: bigint;
    }>;
    getUserTask(taskId: TaskId): Promise<Task>;
    getUserTasks(): Promise<Array<Task>>;
    initializeUser(displayName: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTask(task: Task): Promise<void>;
}
