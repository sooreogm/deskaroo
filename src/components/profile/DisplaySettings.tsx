
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const DisplaySettings = () => {
  const handleSave = () => {
    toast.success("Display settings updated successfully");
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select defaultValue="light">
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="animations">Enable Animations</Label>
            <Switch id="animations" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="compactView">Compact View</Label>
            <Switch id="compactView" />
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplaySettings;
