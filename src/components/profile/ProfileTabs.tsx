
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, BellRing, UserRound } from "lucide-react";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import DisplaySettings from "./DisplaySettings";
import SecuritySettings from "./SecuritySettings";

const ProfileTabs = () => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="account" className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span>Account</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Security</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <BellRing className="h-4 w-4" />
          <span>Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="display" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Display</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <AccountSettings />
      </TabsContent>
      <TabsContent value="security">
        <SecuritySettings />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>
      <TabsContent value="display">
        <DisplaySettings />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
