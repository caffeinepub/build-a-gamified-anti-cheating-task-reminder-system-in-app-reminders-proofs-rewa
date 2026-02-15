import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAddCompletion, useAddReward } from '../../hooks/useQueries';
import type { Task, ProofType, Reward } from '../../backend';
import { toast } from 'sonner';
import RewardCelebration from '../rewards/RewardCelebration';

interface CompleteTaskFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export default function CompleteTaskFlowDialog({ open, onOpenChange, task }: CompleteTaskFlowDialogProps) {
  const [step, setStep] = useState<'proof' | 'reflection' | 'complete'>('proof');
  const [proofType, setProofType] = useState<'textNote' | 'checklistConfirmation' | 'timedSessionLog' | 'photoUpload'>('textNote');
  const [proofData, setProofData] = useState('');
  const [reflection, setReflection] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [earnedReward, setEarnedReward] = useState<Reward | null>(null);

  const addCompletion = useAddCompletion();
  const addReward = useAddReward();

  const handleProofSubmit = () => {
    if (!proofData.trim()) {
      toast.error('Please provide proof of completion');
      return;
    }
    setStep('reflection');
  };

  const handleComplete = async () => {
    let proof: ProofType;
    
    switch (proofType) {
      case 'textNote':
        proof = { __kind__: 'textNote', textNote: proofData };
        break;
      case 'checklistConfirmation':
        proof = { __kind__: 'checklistConfirmation', checklistConfirmation: [true] };
        break;
      case 'timedSessionLog':
        proof = { __kind__: 'timedSessionLog', timedSessionLog: BigInt(proofData || '0') };
        break;
      case 'photoUpload':
        proof = { __kind__: 'photoUpload', photoUpload: proofData };
        break;
    }

    try {
      await addCompletion.mutateAsync({
        taskId: task.id,
        proof,
        reflection: reflection.trim(),
        completionTime: BigInt(Date.now()) * BigInt(1_000_000),
      });

      const reward: Reward = {
        xpGained: BigInt(100),
        coinsGained: BigInt(50),
        levelUp: false,
        streakBonus: Math.random() > 0.5,
        badges: [],
      };

      await addReward.mutateAsync(reward);
      setEarnedReward(reward);
      setShowReward(true);
      
      setTimeout(() => {
        onOpenChange(false);
        setStep('proof');
        setProofData('');
        setReflection('');
      }, 3000);
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  return (
    <>
      <Dialog open={open && !showReward} onOpenChange={onOpenChange}>
        <DialogContent className="game-panel max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Complete Task
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {step === 'proof' ? 'Provide proof of completion' : 'Reflect on your accomplishment'}
            </DialogDescription>
          </DialogHeader>

          {step === 'proof' && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Proof Type</Label>
                <Select value={proofType} onValueChange={(value: any) => setProofType(value)}>
                  <SelectTrigger className="bg-muted/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="game-panel">
                    <SelectItem value="textNote">Text Note</SelectItem>
                    <SelectItem value="checklistConfirmation">Checklist</SelectItem>
                    <SelectItem value="timedSessionLog">Timed Session</SelectItem>
                    <SelectItem value="photoUpload">Photo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {proofType === 'timedSessionLog' ? 'Duration (minutes)' : 'Details'}
                </Label>
                {proofType === 'timedSessionLog' ? (
                  <Input
                    type="number"
                    value={proofData}
                    onChange={(e) => setProofData(e.target.value)}
                    placeholder="30"
                    className="bg-muted/50 border-border/50 focus:border-primary/50"
                  />
                ) : (
                  <Textarea
                    value={proofData}
                    onChange={(e) => setProofData(e.target.value)}
                    placeholder="Describe what you did..."
                    rows={4}
                    className="bg-muted/50 border-border/50 focus:border-primary/50"
                  />
                )}
              </div>

              <Button onClick={handleProofSubmit} className="game-cta w-full">
                Next: Reflection
              </Button>
            </div>
          )}

          {step === 'reflection' && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Reflection</Label>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="How did it go? What did you learn?"
                  rows={4}
                  className="bg-muted/50 border-border/50 focus:border-primary/50"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep('proof')} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={addCompletion.isPending || addReward.isPending}
                  className="game-cta flex-1"
                >
                  {addCompletion.isPending || addReward.isPending ? 'Completing...' : 'Complete Task'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showReward && earnedReward && (
        <RewardCelebration
          reward={earnedReward}
          onClose={() => setShowReward(false)}
        />
      )}
    </>
  );
}
