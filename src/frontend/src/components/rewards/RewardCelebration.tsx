import { useEffect } from 'react';
import { Trophy, Coins, Zap, TrendingUp, Sparkles } from 'lucide-react';
import type { Reward } from '../../backend';

interface RewardCelebrationProps {
  reward: Reward;
  onClose: () => void;
}

export default function RewardCelebration({ reward, onClose }: RewardCelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="reward-overlay">
      <div className="reward-panel text-center space-y-6">
        <div className="relative">
          <Trophy className="h-24 w-24 text-chart-1 mx-auto drop-shadow-glow-lg motion-safe:animate-bounce" />
          {reward.levelUp && (
            <div className="absolute -top-2 -right-2 motion-safe:animate-pulse">
              <TrendingUp className="h-10 w-10 text-chart-2 drop-shadow-glow-md" />
            </div>
          )}
          <Sparkles className="absolute -bottom-2 -left-2 h-8 w-8 text-primary motion-safe:animate-pulse" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Quest Complete!
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="game-chip-primary text-base px-5 py-2">
              <Zap className="h-5 w-5" />
              +{reward.xpGained.toString()} XP
            </div>
            <div className="game-chip text-base px-5 py-2 bg-chart-4/20 text-chart-4 border-chart-4/50">
              <Coins className="h-5 w-5" />
              +{reward.coinsGained.toString()} Coins
            </div>
          </div>
          {reward.levelUp && (
            <div className="game-chip text-lg px-6 py-3 bg-chart-2/20 text-chart-2 border-chart-2/50 motion-safe:animate-pulse">
              🎉 Level Up!
            </div>
          )}
          {reward.streakBonus && (
            <div className="game-chip text-lg px-6 py-3 bg-chart-3/20 text-chart-3 border-chart-3/50">
              🔥 Streak Bonus!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
