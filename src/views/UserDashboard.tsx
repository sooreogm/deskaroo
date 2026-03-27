
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NavBar from '@/components/NavBar';
import { getAllUsers, isAdmin } from '@/utils/users';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { User, Announcement } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Users, BarChart as BarChartIcon, Activity, MessageSquare, Plus } from 'lucide-react';
import { getAllTeams, getCurrentUserTeam } from '@/utils/teams';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AnnouncementCard from '@/components/announcements/AnnouncementCard';
import AnnouncementForm from '@/components/announcements/AnnouncementForm';
import { getCurrentUserTeamAnnouncements, getAllAnnouncements } from '@/utils/announcements';

const UserDashboard = () => {
  const users = getAllUsers();
  const teams = getAllTeams();
  const isUserAdmin = isAdmin();
  const currentUserTeam = getCurrentUserTeam();
  
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showNewAnnouncementDialog, setShowNewAnnouncementDialog] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    isUserAdmin ? getAllAnnouncements() : getCurrentUserTeamAnnouncements()
  );
  
  // Reload announcements after creating a new one
  const reloadAnnouncements = () => {
    setAnnouncements(isUserAdmin ? getAllAnnouncements() : getCurrentUserTeamAnnouncements());
    setShowNewAnnouncementDialog(false);
  };
  
  // Redirect non-admin users
  React.useEffect(() => {
    if (!isUserAdmin) {
      toast.error("You don't have permission to access this page");
      window.location.href = '/dashboard';
    }
  }, [isUserAdmin]);

  // Create data for the team distribution chart
  const teamDistributionData = teams.map(team => ({
    name: team.name,
    members: team.members.length,
  }));

  // Create data for user roles chart
  const userRolesData = [
    { name: 'Admin', count: users.filter(user => user.role === 'admin').length },
    { name: 'User', count: users.filter(user => user.role === 'user').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                <Users size={16} />
                <span>View All Users</span>
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>All Users</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <UsersTable users={users} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Users" value={users.length} icon={<Users className="h-6 w-6" />} />
              <StatCard title="Teams" value={teams.length} icon={<Users className="h-6 w-6" />} />
              <StatCard title="Admins" value={users.filter(user => user.role === 'admin').length} icon={<Users className="h-6 w-6" />} />
              <StatCard title="Regular Users" value={users.filter(user => user.role === 'user').length} icon={<Users className="h-6 w-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="h-5 w-5" />
                    <span>Team Distribution</span>
                  </CardTitle>
                  <CardDescription>Number of members in each team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={{
                      team1: { theme: { light: '#9b87f5', dark: '#9b87f5' } },
                      team2: { theme: { light: '#7E69AB', dark: '#7E69AB' } },
                    }}>
                      <BarChart data={teamDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="members" fill="#9b87f5" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <span>User Roles</span>
                  </CardTitle>
                  <CardDescription>Distribution of user roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={{
                      admin: { theme: { light: '#ea384c', dark: '#ea384c' } },
                      user: { theme: { light: '#1EAEDB', dark: '#1EAEDB' } },
                    }}>
                      <BarChart data={userRolesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#1EAEDB" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Users currently active in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersTable users={users} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Team Announcements</h2>
              <Dialog open={showNewAnnouncementDialog} onOpenChange={setShowNewAnnouncementDialog}>
                <DialogTrigger asChild>
                  <Button className="inline-flex items-center gap-2">
                    <Plus size={16} />
                    <span>New Announcement</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                  </DialogHeader>
                  <AnnouncementForm onSuccess={reloadAnnouncements} />
                </DialogContent>
              </Dialog>
            </div>
            
            {announcements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-500">No announcements yet</p>
                  <p className="text-sm text-gray-400 mb-6">Create a new announcement to share updates with your team</p>
                  <Button onClick={() => setShowNewAnnouncementDialog(true)}>
                    Create Announcement
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {announcements.map(announcement => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Users Table Component
const UsersTable = ({ users }: { users: User[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell className="font-medium">{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
              {user.role}
            </span>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default UserDashboard;
