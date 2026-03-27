import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

const AccountSettings = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    setDepartment(profile.department || '');
    setInitialized(true);
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name, phone, department });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ''} alt={name} />
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <Button variant="outline" type="button" className="mr-2" asChild>
                    <span>{uploadAvatar.isPending ? 'Uploading...' : 'Upload Avatar'}</span>
                  </Button>
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(optional)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="(optional)" />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default AccountSettings;
