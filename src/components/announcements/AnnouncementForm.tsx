import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllTeams, getCurrentUserTeam } from '@/utils/teams';
import { createAnnouncement } from '@/utils/announcements';
import { isAdmin } from '@/utils/users';
import { toast } from 'sonner';

interface AnnouncementFormProps {
  onSuccess?: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSuccess }) => {
  const currentUserTeam = getCurrentUserTeam();
  const isUserAdmin = isAdmin();
  const teams = isUserAdmin ? getAllTeams() : [];
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [teamId, setTeamId] = useState(currentUserTeam?.id || '');
  const [important, setImportant] = useState(false);
  const [requiresAcknowledgment, setRequiresAcknowledgment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !teamId) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      createAnnouncement(title, content, teamId, important, requiresAcknowledgment);
      setTitle('');
      setContent('');
      setImportant(false);
      setRequiresAcknowledgment(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating announcement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your announcement here..."
          required
          className="min-h-[120px]"
        />
      </div>
      
      {isUserAdmin && (
        <div className="space-y-2">
          <Label htmlFor="team">Team</Label>
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="important" 
          checked={important} 
          onCheckedChange={setImportant} 
        />
        <Label htmlFor="important">Mark as important</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="requiresAcknowledgment" 
          checked={requiresAcknowledgment} 
          onCheckedChange={setRequiresAcknowledgment} 
        />
        <Label htmlFor="requiresAcknowledgment">Require acknowledgment</Label>
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Announcement'}
      </Button>
    </form>
  );
};

export default AnnouncementForm;
