
import { useState } from 'react';
import { Inbox, Mail, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessagesList from './MessagesList';
import { 
  getCurrentUserInbox, 
  getCurrentUserSentMessages, 
  getStarredMessages 
} from '@/utils';

const MessageTabs = () => {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <Tabs defaultValue="inbox" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inbox" className="flex items-center gap-2">
          <Inbox className="h-4 w-4" />
          <span>Inbox</span>
        </TabsTrigger>
        <TabsTrigger value="sent" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>Sent</span>
        </TabsTrigger>
        <TabsTrigger value="starred" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          <span>Starred</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inbox">
        <MessagesList messages={getCurrentUserInbox()} type="inbox" />
      </TabsContent>

      <TabsContent value="sent">
        <MessagesList messages={getCurrentUserSentMessages()} type="sent" />
      </TabsContent>

      <TabsContent value="starred">
        <MessagesList messages={getStarredMessages()} type="starred" />
      </TabsContent>
    </Tabs>
  );
};

export default MessageTabs;
