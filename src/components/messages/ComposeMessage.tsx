
import { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllUsers, sendMessage } from '@/utils';
import { User } from '@/types';
import { toast } from 'sonner';

interface ComposeMessageProps {
  initialRecipient?: string;
  subject?: string;
  onCancel?: () => void;
  onSend?: () => void;
}

const ComposeMessage = ({ 
  initialRecipient = '', 
  subject = '', 
  onCancel, 
  onSend 
}: ComposeMessageProps) => {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [messageSubject, setMessageSubject] = useState(subject);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient) {
      toast.error('Please select a recipient');
      return;
    }
    
    if (!messageSubject) {
      toast.error('Please enter a subject');
      return;
    }
    
    if (!content) {
      toast.error('Please enter a message');
      return;
    }

    setSubmitting(true);
    
    try {
      sendMessage(recipient, messageSubject, content);
      toast.success('Message sent successfully');
      
      // Reset form
      setRecipient('');
      setMessageSubject('');
      setContent('');
      
      if (onSend) {
        onSend();
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="recipient">To</Label>
        <Select value={recipient} onValueChange={setRecipient}>
          <SelectTrigger id="recipient">
            <SelectValue placeholder="Select recipient" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={messageSubject}
          onChange={(e) => setMessageSubject(e.target.value)}
          placeholder="Enter subject"
        />
      </div>

      <div>
        <Label htmlFor="content">Message</Label>
        <ScrollArea className="h-40">
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here"
            className="min-h-[160px] resize-none"
          />
        </ScrollArea>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>
    </form>
  );
};

export default ComposeMessage;
