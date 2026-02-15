import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetUserTasks } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Clock, Flame, Target, TrendingUp, Zap, Coins, Play } from 'lucide-react';
import { useMemo } from 'react';

export default function HomePage() {
  const { userProfile } = useCurrentUser();
  const { data: tasks = [] } = useGetUserTasks();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const now = Date.now();
    const nowNano = BigInt(now) * BigInt(1_000_000);
    
    const dueTasks = tasks.filter((task) => {
      const nextTarget = task.targetTimes[0];
      return nextTarget && nextTarget <= nowNano;
    });

    const overdueTasks = tasks.filter((task) => {
      const nextTarget = task.targetTimes[0];
      const gracePeriodNano = task.gracePeriod * BigInt(60_000_000_000);
      return nextTarget && nextTarget + gracePeriodNano < nowNano;
    });

    return {
      totalTasks: tasks.length,
      dueTasks: dueTasks.length,
      overdueTasks: overdueTasks.length,
      nextTask: dueTasks[0] || tasks[0],
    };
  }, [tasks]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const xpToNextLevel = userProfile ? Number(userProfile.level) * 1000 : 1000;
  const currentLevelXP = userProfile ? Number(userProfile.totalXP) % xpToNextLevel : 0;
  const xpProgress = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Hero Panel - Player Dashboard */}
      <div className="game-panel-accent p-6 space-y-6">
        {/* Welcome & Profile */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {greeting}, {userProfile?.displayName || 'Adventurer'}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to conquer today's challenges?
            </p>
          </div>
          <img 
            src="/assets/generated/mascot.dim_1024x1024.png" 
            alt="Mascot" 
            className="hidden md:block w-24 h-24 object-contain drop-shadow-glow-md"
          />
        </div>

        {/* Level & XP Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-primary/20 border-2 border-primary/50">
                <div className="text-xs text-primary font-semibold">LEVEL</div>
                <div className="text-2xl font-bold text-primary">{userProfile?.level.toString() || '1'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Next Level</div>
                <div className="text-lg font-bold text-foreground">
                  {currentLevelXP} / {xpToNextLevel} XP
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total XP</div>
              <div className="text-xl font-bold text-chart-1">{userProfile?.totalXP.toString() || '0'}</div>
            </div>
          </div>
          <div className="game-progress-track h-4">
            <div 
              className="game-progress-fill" 
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="hud-stat">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-chart-2" />
              <span className="text-xs text-muted-foreground font-semibold">STREAK</span>
            </div>
            <div className="text-2xl font-bold text-chart-2">{userProfile?.streakCount.toString() || '0'}</div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>

          <div className="hud-stat">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-chart-4" />
              <span className="text-xs text-muted-foreground font-semibold">COINS</span>
            </div>
            <div className="text-2xl font-bold text-chart-4">{userProfile?.coins.toString() || '0'}</div>
            <div className="text-xs text-muted-foreground">balance</div>
          </div>

          <div className="hud-stat col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-chart-1" />
              <span className="text-xs text-muted-foreground font-semibold">TASKS DUE</span>
            </div>
            <div className="text-2xl font-bold text-chart-1">{stats.dueTasks}</div>
            <div className="text-xs text-muted-foreground">
              {stats.overdueTasks > 0 ? `${stats.overdueTasks} overdue` : 'All on track'}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks - Primary CTA Section */}
      <div className="game-panel p-6 space-y-4">
        <div className="hud-section-header">
          <Target className="h-6 w-6" />
          Today's Tasks
        </div>

        {stats.nextTask ? (
          <div className="space-y-4">
            <div className="task-card">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-xl text-foreground">{stats.nextTask.title}</h3>
                  <p className="text-sm text-muted-foreground">{stats.nextTask.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`game-chip ${
                      stats.nextTask.priority === 'high' ? 'game-chip-warning' : 
                      stats.nextTask.priority === 'medium' ? 'game-chip-primary' : 
                      'game-chip'
                    }`}>
                      {stats.nextTask.priority.toUpperCase()}
                    </span>
                    <span className="game-chip">{stats.nextTask.category}</span>
                    {stats.nextTask.estimatedDuration && (
                      <span className="game-chip">
                        <Clock className="h-3 w-3" />
                        {stats.nextTask.estimatedDuration.toString()}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate({ to: '/tasks' })}
              className="game-cta w-full"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Task
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <CheckCircle className="h-16 w-16 text-chart-5 mx-auto opacity-50" />
            <div>
              <p className="font-semibold text-lg text-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground">Create a new task to get started</p>
            </div>
            <Button 
              onClick={() => navigate({ to: '/tasks' })}
              className="game-cta"
            >
              Create Task
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div 
          className="game-panel p-5 cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => navigate({ to: '/quests' })}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-chart-1/20">
              <Target className="h-6 w-6 text-chart-1" />
            </div>
            <h3 className="font-bold text-lg">Daily Quests</h3>
          </div>
          <p className="text-sm text-muted-foreground">Complete quests for bonus rewards</p>
        </div>

        <div 
          className="game-panel p-5 cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => navigate({ to: '/rewards' })}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-chart-4/20">
              <Zap className="h-6 w-6 text-chart-4" />
            </div>
            <h3 className="font-bold text-lg">Rewards</h3>
          </div>
          <p className="text-sm text-muted-foreground">Check your achievements and badges</p>
        </div>

        <div 
          className="game-panel p-5 cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => navigate({ to: '/insights' })}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-chart-2/20">
              <TrendingUp className="h-6 w-6 text-chart-2" />
            </div>
            <h3 className="font-bold text-lg">Insights</h3>
          </div>
          <p className="text-sm text-muted-foreground">View your productivity stats</p>
        </div>
      </div>
    </div>
  );
}
