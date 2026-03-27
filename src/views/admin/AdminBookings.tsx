import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetchBookings } from '@/lib/api';

const statusColor: Record<string, string> = {
  confirmed: 'border-primary/25 bg-primary/12 text-foreground',
  checked_in: 'border-black bg-black text-white',
  checked_out: 'border-black/10 bg-muted text-foreground',
  cancelled: 'border-destructive/20 bg-destructive/10 text-destructive',
  pending: 'border-black/10 bg-white text-foreground',
};

const AdminBookings = () => {
  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => fetchBookings({ limit: 100 }),
  });
  const counts = {
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    checkedIn: bookings.filter((booking) => booking.status === 'checked_in').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <span className="page-eyebrow">Bookings</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">All Bookings</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Track recent desk activity across the office and monitor booking status at a glance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Recent bookings</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{bookings.length}</p>
          </div>
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.confirmed}</p>
          </div>
          <div className="shell-panel p-5">
            <p className="text-sm text-muted-foreground">Checked in now</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{counts.checkedIn}</p>
          </div>
        </div>

        <Card className="shell-panel border-0 bg-white/90 shadow-none">
          <CardHeader className="border-b border-black/8 pb-5">
            <CardTitle className="text-xl tracking-tight">Recent Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Desk</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.userName ?? 'Unknown'}</TableCell>
                      <TableCell>{booking.deskName ?? 'N/A'}</TableCell>
                      <TableCell>{booking.roomName ?? 'N/A'}</TableCell>
                      <TableCell>{format(booking.date, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{booking.duration}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusColor[booking.status] ?? ''}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No bookings found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
