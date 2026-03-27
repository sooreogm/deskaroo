import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { updateCurrentUserPassword } from "@/utils/users";

const SecuritySettings = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await updateCurrentUserPassword(newPassword);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default SecuritySettings;
