import { Users, Building2, Calendar, QrCode } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchAdminStats } from '@/lib/api';

const AdminOverview = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  });

  const statCards = [
    { title: 'Total Users', value: stats?.users ?? 0, icon: Users },
    { title: 'Rooms', value: stats?.rooms ?? 0, icon: Building2 },
    { title: 'Desks', value: stats?.desks ?? 0, icon: QrCode },
    { title: 'Bookings', value: stats?.bookings ?? 0, icon: Calendar },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.12fr,0.88fr]">
          <div className="shell-panel p-6 sm:p-8">
            <span className="page-eyebrow">Admin Workspace</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Keep the office desk flow under control
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              This admin area stays focused on the essentials: users, rooms, desks, bookings, and the QR-backed desk workflow.
            </p>
          </div>

          <div className="ink-panel p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">What admins manage</h2>
            <div className="mt-6 space-y-4">
              {[
                'Add and organise rooms and desks.',
                'Keep desk QR codes attached to the right workspace.',
                'Monitor bookings and staff access in one place.',
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-black">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-white/68">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(stat => (
            <div key={stat.title} className="shell-panel p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
