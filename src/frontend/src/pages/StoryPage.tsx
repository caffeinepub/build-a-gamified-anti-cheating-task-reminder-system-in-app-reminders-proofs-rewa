import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function StoryPage() {
  const currentChapter = 1;
  const totalChapters = 10;
  const chapterProgress = (currentChapter / totalChapters) * 100;

  const chapters = [
    { id: 1, title: 'The Beginning', unlocked: true, completed: false },
    { id: 2, title: 'First Steps', unlocked: false, completed: false },
    { id: 3, title: 'Rising Challenge', unlocked: false, completed: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Story Mode</h1>
        <p className="text-muted-foreground">Progress through your productivity journey</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Chapter {currentChapter} of {totalChapters}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={chapterProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Complete tasks and quests to unlock new chapters
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Card
            key={chapter.id}
            className={chapter.unlocked ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'opacity-50'}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Chapter {chapter.id}: {chapter.title}</CardTitle>
                    <CardDescription>
                      {chapter.completed ? 'Completed' : chapter.unlocked ? 'In Progress' : 'Locked'}
                    </CardDescription>
                  </div>
                </div>
                {chapter.unlocked && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
