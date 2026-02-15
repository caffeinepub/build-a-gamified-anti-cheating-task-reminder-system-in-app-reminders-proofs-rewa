import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { Progress } from '../components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    goals: '',
    reminderWindow: 'morning',
    motivationStyle: 'gentle',
    theme: 'system',
  });

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate({ to: '/' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div>
              <CardTitle>Welcome to TaskQuest!</CardTitle>
              <CardDescription>Step {step} of {totalSteps}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <img
                  src="/assets/generated/mascot.dim_1024x1024.png"
                  alt="Mascot"
                  className="w-32 h-32 mx-auto rounded-full"
                />
                <h2 className="text-2xl font-bold">Let's Get Started!</h2>
                <p className="text-muted-foreground">
                  We'll help you set up your productivity adventure in just a few steps.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">What are your goals?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Tell us what you want to achieve (optional)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Your Goals</Label>
                <Input
                  id="goals"
                  placeholder="e.g., Exercise daily, learn a new skill, stay organized..."
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Reminder Preferences</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  When do you prefer to receive reminders?
                </p>
              </div>
              <div className="space-y-2">
                <Label>Preferred Time Window</Label>
                <Select
                  value={formData.reminderWindow}
                  onValueChange={(value) => setFormData({ ...formData, reminderWindow: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6 PM - 10 PM)</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Personalization</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize your experience
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Motivation Style</Label>
                  <Select
                    value={formData.motivationStyle}
                    onValueChange={(value) => setFormData({ ...formData, motivationStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gentle">Gentle & Supportive</SelectItem>
                      <SelectItem value="coach">Coaching & Direct</SelectItem>
                      <SelectItem value="competitive">Competitive & Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={formData.theme}
                    onValueChange={(value) => setFormData({ ...formData, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {step === totalSteps ? 'Get Started' : 'Next'}
              {step < totalSteps && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
