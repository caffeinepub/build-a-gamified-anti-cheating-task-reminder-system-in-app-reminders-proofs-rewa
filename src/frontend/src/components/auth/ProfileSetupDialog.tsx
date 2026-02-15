import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useSaveCallerUserProfile, useInitializeUser } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface ProfileSetupDialogProps {
  open: boolean;
}

export default function ProfileSetupDialog({ open }: ProfileSetupDialogProps) {
  const [displayName, setDisplayName] = useState('');
  const saveProfile = useSaveCallerUserProfile();
  const initializeUser = useInitializeUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error('Please enter a display name');
      return;
    }

    try {
      await initializeUser.mutateAsync(displayName.trim());
      toast.success('Welcome to TaskQuest!');
    } catch (error) {
      toast.error('Failed to create profile');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="game-panel-accent max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Welcome, Adventurer!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Begin your productivity quest by choosing your name
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-semibold">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
              className="bg-muted/50 border-border/50 focus:border-primary/50 text-lg"
            />
          </div>
          <Button
            type="submit"
            disabled={saveProfile.isPending || initializeUser.isPending}
            className="game-cta w-full"
          >
            {saveProfile.isPending || initializeUser.isPending ? 'Creating Profile...' : 'Start Quest'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
