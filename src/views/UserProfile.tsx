
import AppLayout from "@/components/layout/AppLayout";
import ProfileTabs from "@/components/profile/ProfileTabs";

const UserProfile = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <ProfileTabs />
      </div>
    </AppLayout>
  );
};

export default UserProfile;
