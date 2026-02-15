import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from '@tanstack/react-router';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [motivationStyle, setMotivationStyle] = useState('gentle');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="game-panel p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Customize your TaskQuest experience</p>
      </div>

      {/* Preferences */}
      <div className="game-panel p-6">
        <div className="hud-section-header mb-6">
          <Settings className="h-6 w-6" />
          Preferences
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label className="font-semibold">Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32 bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="game-panel">
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label className="font-semibold">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play sounds for rewards and actions</p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label className="font-semibold">Background Music</Label>
              <p className="text-sm text-muted-foreground">Play ambient music while using the app</p>
            </div>
            <Switch checked={musicEnabled} onCheckedChange={setMusicEnabled} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label className="font-semibold">Motivation Style</Label>
              <p className="text-sm text-muted-foreground">Choose your encouragement tone</p>
            </div>
            <Select value={motivationStyle} onValueChange={setMotivationStyle}>
              <SelectTrigger className="w-32 bg-muted/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="game-panel">
                <SelectItem value="gentle">Gentle</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="competitive">Competitive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Onboarding */}
      <div className="game-panel p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-bold">Onboarding</CardTitle>
          <CardDescription>Revisit the initial setup</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Button 
            onClick={() => navigate({ to: '/onboarding' })}
            variant="outline"
            className="hover:bg-primary/20 hover:border-primary/50"
          >
            Restart Onboarding
          </Button>
        </CardContent>
      </div>
    </div>
  );
}
