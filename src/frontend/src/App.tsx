import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCurrentUser } from './hooks/useCurrentUser';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import ReminderCenterPage from './pages/ReminderCenterPage';
import RewardsPage from './pages/RewardsPage';
import StoryPage from './pages/StoryPage';
import AvatarPage from './pages/AvatarPage';
import QuestsPage from './pages/QuestsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import InsightsPage from './pages/InsightsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { useReminderEngine } from './hooks/reminders/useReminderEngine';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { userProfile, isLoading: profileLoading, isFetched } = useCurrentUser();
  const isAuthenticated = !!identity;

  // Initialize reminder engine when authenticated
  useReminderEngine();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <ProfileSetupDialog open={showProfileSetup} />
      <Toaster />
    </ThemeProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TasksPage,
});

const remindersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reminders',
  component: ReminderCenterPage,
});

const rewardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rewards',
  component: RewardsPage,
});

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story',
  component: StoryPage,
});

const avatarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/avatar',
  component: AvatarPage,
});

const questsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quests',
  component: QuestsPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/insights',
  component: InsightsPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  onboardingRoute,
  tasksRoute,
  remindersRoute,
  rewardsRoute,
  storyRoute,
  avatarRoute,
  questsRoute,
  leaderboardRoute,
  insightsRoute,
  historyRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
