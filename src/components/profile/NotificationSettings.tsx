
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NotificationSettings = () => {
  const handleSave = () => {
    toast.success("Notification settings updated successfully");
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch id="emailNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
            <Switch id="desktopNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="teamUpdates">Team Updates</Label>
            <Switch id="teamUpdates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="announcementNotifications">Announcements</Label>
            <Switch id="announcementNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="bookingReminders">Booking Reminders</Label>
            <Switch id="bookingReminders" defaultChecked />
          </div>
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
