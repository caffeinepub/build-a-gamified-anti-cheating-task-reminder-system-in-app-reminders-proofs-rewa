import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Badge } from '../components/ui/badge';
import { User } from 'lucide-react';

export default function AvatarPage() {
  const { userProfile } = useCurrentUser();

  const avatarStages = [
    { level: 1, name: 'Novice', unlocked: true },
    { level: 5, name: 'Apprentice', unlocked: false },
    { level: 10, name: 'Adept', unlocked: false },
    { level: 20, name: 'Expert', unlocked: false },
    { level: 50, name: 'Master', unlocked: false },
    { level: 100, name: 'Legend', unlocked: false },
  ];

  const currentLevel = userProfile ? Number(userProfile.level) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="game-panel p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Avatar
        </h1>
        <p className="text-muted-foreground mt-1">Customize your productivity companion</p>
      </div>

      {/* Current Avatar */}
      <div className="game-panel-accent p-6">
        <div className="hud-section-header mb-4">
          <User className="h-6 w-6" />
          Current Avatar
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Level {currentLevel} - {avatarStages.find(s => s.level <= currentLevel && s.unlocked)?.name || 'Novice'}
        </p>
        <div className="flex justify-center">
          <img
            src="/assets/generated/avatar-stages.dim_2048x1024.png"
            alt="Avatar Stages"
            className="max-w-full h-auto rounded-lg shadow-glow-md"
          />
        </div>
      </div>

      {/* Avatar Progression */}
      <div className="game-panel p-6">
        <div className="hud-section-header mb-6">
          <User className="h-6 w-6" />
          Avatar Progression
        </div>
        <p className="text-sm text-muted-foreground mb-6">Unlock new looks as you level up</p>
        <div className="space-y-3">
          {avatarStages.map((stage) => (
            <div
              key={stage.level}
              className={`task-card ${
                currentLevel >= stage.level ? 'border-primary/60' : 'opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    currentLevel >= stage.level ? 'bg-primary/20 ring-2 ring-primary/50' : 'bg-muted/50'
                  }`}>
                    <User className={`h-6 w-6 ${currentLevel >= stage.level ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{stage.name}</p>
                    <p className="text-sm text-muted-foreground">Level {stage.level}</p>
                  </div>
                </div>
                {currentLevel >= stage.level ? (
                  <span className="game-chip-success">Unlocked</span>
                ) : (
                  <span className="game-chip">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
