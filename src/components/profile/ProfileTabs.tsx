
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, BellRing, UserRound } from "lucide-react";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import DisplaySettings from "./DisplaySettings";
import SecuritySettings from "./SecuritySettings";

const ProfileTabs = () => {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/70 p-1 sm:grid-cols-4">
        <TabsTrigger value="account" className="flex min-h-[48px] items-center gap-2 whitespace-normal px-3 py-2 text-center">
          <UserRound className="h-4 w-4" />
          <span>Account</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex min-h-[48px] items-center gap-2 whitespace-normal px-3 py-2 text-center">
          <User className="h-4 w-4" />
          <span>Security</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex min-h-[48px] items-center gap-2 whitespace-normal px-3 py-2 text-center">
          <BellRing className="h-4 w-4" />
          <span>Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="display" className="flex min-h-[48px] items-center gap-2 whitespace-normal px-3 py-2 text-center">
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
