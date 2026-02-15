import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Target, Swords } from 'lucide-react';

export default function QuestsPage() {
  const dailyQuests = [
    { id: 1, title: 'Complete 3 tasks', progress: 0, total: 3, reward: '50 XP' },
    { id: 2, title: 'Maintain your streak', progress: 1, total: 1, reward: '30 XP' },
    { id: 3, title: 'Submit proof for all tasks', progress: 0, total: 1, reward: '40 XP' },
  ];

  const bossChallenge = {
    title: 'Weekly Boss: The Procrastination Dragon',
    description: 'Complete 20 tasks this week without skipping any',
    progress: 0,
    total: 20,
    reward: '500 XP + Rare Badge',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quests</h1>
        <p className="text-muted-foreground">Complete challenges for bonus rewards</p>
      </div>

      <Card className="border-chart-2 bg-gradient-to-br from-chart-2/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-chart-2" />
            Boss Challenge
          </CardTitle>
          <CardDescription>{bossChallenge.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{bossChallenge.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{bossChallenge.progress} / {bossChallenge.total}</span>
            </div>
            <Progress value={(bossChallenge.progress / bossChallenge.total) * 100} className="h-3" />
          </div>
          <Badge className="bg-chart-2">{bossChallenge.reward}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-chart-1" />
            Daily Quests
          </CardTitle>
          <CardDescription>Reset every day at midnight</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyQuests.map((quest) => (
            <div key={quest.id} className="space-y-2 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="font-medium">{quest.title}</p>
                <Badge variant="outline">{quest.reward}</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{quest.progress} / {quest.total}</span>
                </div>
                <Progress value={(quest.progress / quest.total) * 100} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
