
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Announcement } from '@/types';
import { getAnnouncementCreatorName, acknowledgeAnnouncement, hasUserAcknowledged } from '@/utils/announcements';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/utils/users';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const creatorName = getAnnouncementCreatorName(announcement);
  const currentUser = getCurrentUser();
  const hasAcknowledged = hasUserAcknowledged(announcement.id, currentUser.id);
  const showAcknowledgeButton = announcement.requiresAcknowledgment && !hasAcknowledged;

  const formattedDate = new Date(announcement.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleAcknowledge = () => {
    acknowledgeAnnouncement(announcement.id);
  };

  return (
    <Card className={`${announcement.important ? 'border-amber-400' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{announcement.title}</CardTitle>
          <div className="flex gap-2">
            {announcement.requiresAcknowledgment && !hasAcknowledged && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                <Bell className="h-3 w-3 mr-1" />
                Needs Acknowledgment
              </Badge>
            )}
            {announcement.important && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Important
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
          <User className="h-3 w-3 mr-1" />
          {creatorName}
          <span className="mx-2">•</span>
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{announcement.content}</p>
      </CardContent>
      {showAcknowledgeButton && (
        <CardFooter>
          <Button onClick={handleAcknowledge} className="w-full">
            Acknowledge Announcement
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AnnouncementCard;
