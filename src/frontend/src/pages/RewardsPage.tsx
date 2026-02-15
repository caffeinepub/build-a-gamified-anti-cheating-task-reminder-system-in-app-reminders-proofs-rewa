import { useCurrentUser } from '../hooks/useCurrentUser';
import { useGetRewardHistory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Coins, Zap, Award, Gift } from 'lucide-react';

export default function RewardsPage() {
  const { userProfile } = useCurrentUser();
  const { data: rewardHistory = [] } = useGetRewardHistory();

  const xpToNextLevel = userProfile ? Number(userProfile.level) * 1000 : 1000;
  const currentLevelXP = userProfile ? Number(userProfile.totalXP) % xpToNextLevel : 0;
  const xpProgress = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="game-panel p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Rewards
        </h1>
        <p className="text-muted-foreground mt-1">Track your progress and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="hud-stat">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-chart-1" />
            <span className="text-xs text-muted-foreground font-semibold">TOTAL XP</span>
          </div>
          <div className="text-3xl font-bold text-chart-1">{userProfile?.totalXP.toString() || '0'}</div>
          <div className="xp-bar-container mt-3">
            <div className="game-progress-track">
              <div className="game-progress-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {currentLevelXP} / {xpToNextLevel} to Level {userProfile ? Number(userProfile.level) + 1 : 2}
            </p>
          </div>
        </div>

        <div className="hud-stat">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="h-5 w-5 text-chart-4" />
            <span className="text-xs text-muted-foreground font-semibold">COINS</span>
          </div>
          <div className="text-3xl font-bold text-chart-4">{userProfile?.coins.toString() || '0'}</div>
          <p className="text-xs text-muted-foreground mt-3">Spend on themes and skins</p>
        </div>

        <div className="hud-stat">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-chart-2" />
            <span className="text-xs text-muted-foreground font-semibold">BADGES</span>
          </div>
          <div className="text-3xl font-bold text-chart-2">{userProfile?.badges.length || 0}</div>
          <p className="text-xs text-muted-foreground mt-3">Collected achievements</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="badges" className="space-y-4">
        <TabsList className="game-panel p-1">
          <TabsTrigger value="badges" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Badges
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            History
          </TabsTrigger>
          <TabsTrigger value="chest" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Weekly Chest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          <div className="game-panel p-6">
            <div className="hud-section-header mb-6">
              <Award className="h-6 w-6" />
              Badge Collection
            </div>
            {userProfile?.badges && userProfile.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userProfile.badges.map((badge, index) => (
                  <div key={index} className="text-center space-y-3 p-4 game-panel hover:scale-105 transition-transform">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center shadow-glow-md">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-sm font-semibold">{badge}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No badges yet. Complete tasks to earn your first badge!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="game-panel p-6">
            <div className="hud-section-header mb-6">
              <Trophy className="h-6 w-6" />
              Reward History
            </div>
            {rewardHistory.length > 0 ? (
              <div className="space-y-3">
                {rewardHistory.slice(0, 10).map((reward, index) => (
                  <div key={index} className="task-card">
                    <div className="flex flex-wrap gap-2">
                      <span className="game-chip-primary">+{reward.xpGained.toString()} XP</span>
                      <span className="game-chip bg-chart-4/20 text-chart-4 border-chart-4/50">
                        +{reward.coinsGained.toString()} Coins
                      </span>
                      {reward.levelUp && <span className="game-chip bg-chart-2/20 text-chart-2 border-chart-2/50">Level Up!</span>}
                      {reward.streakBonus && <span className="game-chip bg-chart-3/20 text-chart-3 border-chart-3/50">Streak Bonus</span>}
                    </div>
                    {reward.badges.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Badges: {reward.badges.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No rewards yet. Complete tasks to start earning!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chest" className="space-y-4">
          <div className="game-panel-accent p-8">
            <div className="hud-section-header mb-6 justify-center">
              <Gift className="h-6 w-6" />
              Weekly Reward Chest
            </div>
            <div className="text-center space-y-6">
              <img
                src="/assets/generated/weekly-chest-closed.dim_1024x1024.png"
                alt="Weekly Chest"
                className="w-64 h-64 mx-auto drop-shadow-glow-lg"
              />
              <p className="text-muted-foreground text-lg">
                Complete 7 tasks this week to unlock your reward chest!
              </p>
              <div className="max-w-md mx-auto space-y-2">
                <div className="game-progress-track h-4">
                  <div className="game-progress-fill" style={{ width: '0%' }} />
                </div>
                <p className="text-sm text-muted-foreground">0 / 7 tasks completed</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
