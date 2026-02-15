import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import LoginButton from '../auth/LoginButton';
import { Button } from '../ui/button';
import {
  Home,
  CheckSquare,
  Bell,
  Trophy,
  BookOpen,
  User,
  Target,
  BarChart3,
  History,
  Settings,
  Menu,
  Crown,
  Coins,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { userProfile } = useCurrentUser();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/reminders', label: 'Reminders', icon: Bell },
    { path: '/rewards', label: 'Rewards', icon: Trophy },
    { path: '/story', label: 'Story', icon: BookOpen },
    { path: '/avatar', label: 'Avatar', icon: User },
    { path: '/quests', label: 'Quests', icon: Target },
    { path: '/leaderboard', label: 'Leaderboard', icon: Crown },
    { path: '/insights', label: 'Insights', icon: BarChart3 },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const xpToNextLevel = userProfile ? Number(userProfile.level) * 1000 : 1000;
  const xpProgress = userProfile ? (Number(userProfile.totalXP) % xpToNextLevel) / xpToNextLevel * 100 : 0;

  const NavContent = () => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Button
            key={item.path}
            variant="ghost"
            className={`justify-start gap-3 rounded-lg transition-all ${
              isActive ? 'nav-item-active' : 'hover:bg-muted/50'
            }`}
            onClick={() => {
              navigate({ to: item.path });
              setMobileMenuOpen(false);
            }}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Game HUD Style */}
      <header className="sticky top-0 z-50 w-full game-header">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 game-panel border-r-2">
                <div className="mt-8">
                  <NavContent />
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/assets/generated/logo-mark.dim_512x512.png" 
                  alt="Logo" 
                  className="h-10 w-10 drop-shadow-glow-sm" 
                />
                <div className="absolute inset-0 bg-primary/20 blur-xl -z-10" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                TaskQuest
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-chart-4/20 border border-chart-4/40">
                  <Coins className="h-4 w-4 text-chart-4" />
                  <span className="font-bold text-chart-4">{userProfile.coins.toString()}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{userProfile.displayName}</div>
                  <div className="text-xs text-primary font-medium">
                    Level {userProfile.level.toString()}
                  </div>
                </div>
                <Avatar className="h-10 w-10 ring-2 ring-primary/50">
                  <AvatarImage src={userProfile.avatarUrl?.getDirectURL()} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {userProfile.displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      <div className="container flex gap-6 px-4 py-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-4">
            {userProfile && (
              <div className="game-panel p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 ring-2 ring-primary/50">
                    <AvatarImage src={userProfile.avatarUrl?.getDirectURL()} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                      {userProfile.displayName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-foreground">{userProfile.displayName}</div>
                    <div className="text-sm text-primary font-semibold">Level {userProfile.level.toString()}</div>
                  </div>
                </div>
                
                <div className="xp-bar-container">
                  <div className="xp-bar-label">
                    <span className="xp-bar-label-left">XP Progress</span>
                    <span className="xp-bar-label-right">{Math.round(xpProgress)}%</span>
                  </div>
                  <div className="game-progress-track">
                    <div 
                      className="game-progress-fill" 
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {(Number(userProfile.totalXP) % xpToNextLevel).toString()} / {xpToNextLevel} XP
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1 hud-stat">
                    <div className="text-xs text-muted-foreground mb-1">Coins</div>
                    <div className="font-bold text-chart-4 flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      {userProfile.coins.toString()}
                    </div>
                  </div>
                  <div className="flex-1 hud-stat">
                    <div className="text-xs text-muted-foreground mb-1">Streak</div>
                    <div className="font-bold text-chart-2 flex items-center gap-1">
                      🔥 {userProfile.streakCount.toString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="game-panel p-3">
              <NavContent />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 bg-card/50">
        <div className="container px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
