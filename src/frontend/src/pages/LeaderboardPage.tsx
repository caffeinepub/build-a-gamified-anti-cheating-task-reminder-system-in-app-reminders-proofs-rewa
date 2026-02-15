import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Crown, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function LeaderboardPage() {
  const { userProfile } = useCurrentUser();

  const personalStats = [
    { label: 'This Week XP', value: '450', change: '+12%' },
    { label: 'This Week Coins', value: '120', change: '+8%' },
    { label: 'Current Streak', value: userProfile?.streakCount.toString() || '0', change: 'days' },
    { label: 'Tasks Completed', value: '15', change: 'this week' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="game-panel p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-1">Track your personal progress</p>
      </div>

      {/* Your Stats */}
      <div className="game-panel p-6">
        <div className="hud-section-header mb-6">
          <Crown className="h-6 w-6" />
          Your Stats
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {personalStats.map((stat) => (
            <div key={stat.label} className="hud-stat">
              <p className="text-xs text-muted-foreground font-semibold mb-2">{stat.label.toUpperCase()}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <span className="game-chip-success text-xs">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="game-panel p-6">
        <div className="hud-section-header mb-6">
          <TrendingUp className="h-6 w-6" />
          Weekly Progress
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Keep completing tasks to see your progress trends!
          </p>
        </div>
      </div>
    </div>
  );
}
