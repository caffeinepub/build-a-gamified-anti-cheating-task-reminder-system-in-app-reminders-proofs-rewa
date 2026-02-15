import { Button } from '../components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { CheckCircle, Zap, Trophy, Target, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();

  const features = [
    {
      icon: Zap,
      title: 'Smart Reminders',
      description: 'Never miss a task with intelligent, adaptive reminders',
    },
    {
      icon: CheckCircle,
      title: 'Proof of Completion',
      description: 'Build accountability with completion verification',
    },
    {
      icon: Trophy,
      title: 'Rewards & Gamification',
      description: 'Earn XP, coins, badges, and unlock achievements',
    },
    {
      icon: Target,
      title: 'Daily Quests',
      description: 'Complete quests and boss challenges for bonus rewards',
    },
    {
      icon: Shield,
      title: 'Anti-Cheating System',
      description: 'Fair and transparent reward system',
    },
    {
      icon: Sparkles,
      title: 'Story Progression',
      description: 'Advance through chapters as you complete tasks',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Hero Section */}
      <div className="container px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/logo-mark.dim_512x512.png" alt="TaskQuest Logo" className="h-16 w-16" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              TaskQuest
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Transform your productivity into an epic adventure. Complete tasks, earn rewards, and level up your life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 transition-opacity"
            >
              {loginStatus === 'logging-in' ? 'Connecting...' : 'Start Your Quest'}
            </Button>
          </div>

          <div className="mt-12">
            <img
              src="/assets/generated/mascot.dim_1024x1024.png"
              alt="TaskQuest Mascot"
              className="w-64 h-64 mx-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Stay Motivated
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 space-y-3 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 rounded-2xl border bg-gradient-to-br from-primary/5 to-chart-1/5 p-12">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Level Up?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of productive adventurers and start your journey today.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            className="text-lg px-8 py-6"
          >
            {loginStatus === 'logging-in' ? 'Connecting...' : 'Get Started Free'}
          </Button>
        </div>
      </div>
    </div>
  );
}
