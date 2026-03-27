
import { useState } from 'react';
import { format } from 'date-fns';
import { MessageCircle, Star, StarOff } from 'lucide-react';
import { Message } from '@/types';
import { 
  markMessageAsRead, 
  toggleMessageStarred, 
  getMessageSender 
} from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MessageView from './MessageView';

interface MessagesListProps {
  messages: Message[];
  type: 'inbox' | 'sent' | 'starred';
}

const MessagesList = ({ messages, type }: MessagesListProps) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);

  const handleMessageClick = (message: Message) => {
    if (type === 'inbox' && !message.read) {
      markMessageAsRead(message.id);
    }
    setSelectedMessage(message);
    setMessageOpen(true);
  };

  const handleToggleStarred = (e: React.MouseEvent, message: Message) => {
    e.stopPropagation();
    toggleMessageStarred(message.id);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No messages</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {type === 'inbox' 
            ? "Your inbox is empty" 
            : type === 'sent' 
              ? "You haven't sent any messages yet" 
              : "You have no starred messages"}
        </p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-240px)] rounded-md border">
        <div className="divide-y">
          {messages.map((message) => {
            const sender = getMessageSender(message);
            return (
              <div 
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`p-4 hover:bg-muted cursor-pointer transition-colors ${!message.read && type === 'inbox' ? 'bg-amber-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-medium ${!message.read && type === 'inbox' ? 'font-semibold' : ''}`}>
                        {type === 'sent' ? `To: ${sender?.name || 'Unknown'}` : sender?.name || 'Unknown'}
                      </h3>
                      {!message.read && type === 'inbox' && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          New
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-medium mt-1">{message.subject}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={(e) => handleToggleStarred(e, message)}
                    >
                      {message.starred ? (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {format(message.createdAt, 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && <MessageView message={selectedMessage} type={type} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessagesList;
