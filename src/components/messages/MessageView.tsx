
import { format } from 'date-fns';
import { Star, StarOff, Reply, Trash2 } from 'lucide-react';
import { Message } from '@/types';
import { getMessageSender, toggleMessageStarred, deleteMessage } from '@/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import ComposeMessage from './ComposeMessage';

interface MessageViewProps {
  message: Message;
  type: 'inbox' | 'sent' | 'starred';
}

const MessageView = ({ message, type }: MessageViewProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  
  const user = getMessageSender(message);
  const nameInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : '?';

  const handleToggleStar = () => {
    toggleMessageStarred(message.id);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
    setIsDeleted(true);
  };

  if (isDeleted) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <Trash2 className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">Message deleted</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{nameInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{type === 'sent' ? `To: ${user?.name || 'Unknown'}` : user?.name || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">
              {format(message.createdAt, 'PPpp')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleToggleStar}>
            {message.starred ? (
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
            ) : (
              <StarOff className="h-4 w-4 mr-1" />
            )}
            {message.starred ? 'Starred' : 'Star'}
          </Button>
          {type === 'inbox' && (
            <Button variant="outline" size="sm" onClick={() => setIsReplying(true)}>
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="text-lg font-medium mb-4">{message.subject}</h2>
        <div className="prose prose-sm max-w-none">
          <p>{message.content}</p>
        </div>
      </div>

      {isReplying && type === 'inbox' && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Reply to {user?.name}</h3>
          <ComposeMessage 
            initialRecipient={user?.id || ''} 
            subject={`Re: ${message.subject}`}
            onCancel={() => setIsReplying(false)}
            onSend={() => setIsReplying(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MessageView;
