import Link from 'next/link';
import { ArrowRight, BarChart3, Calendar, Clock, MapPin, MessageSquare, QrCode } from 'lucide-react';
import { format, isFuture, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBookings } from '@/hooks/useBookings';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { data: bookings = [] } = useUserBookings();

  const todayBookings = bookings.filter((booking) => isToday(booking.date) && booking.status !== 'cancelled');
  const upcomingBookings = bookings
    .filter((booking) => isFuture(booking.date) && !isToday(booking.date) && booking.status !== 'cancelled')
    .slice(0, 5);

  const actionCards = [
    {
      href: '/book',
      title: 'Book a Desk',
      description: 'Reserve a desk for the office day you need',
      icon: Calendar,
    },
    {
      href: '/mybookings',
      title: 'My Bookings',
      description: 'See upcoming bookings and manage changes',
      icon: Clock,
    },
    {
      href: '/community',
      title: 'Community Space',
      description: 'Join the shared conversation with everyone in the office',
      icon: MessageSquare,
    },
  ];

  if (isAdmin) {
    actionCards.push({
      href: '/admin',
      title: 'Admin Panel',
      description: 'Manage rooms, desks, users, and bookings',
      icon: BarChart3,
    });
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.22fr,0.78fr]">
          <div className="shell-panel p-6 sm:p-8">
            <span className="page-eyebrow">Workspace Overview</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Your desk schedule stays focused here: book what you need, review today&apos;s reservation, and use the desk QR code when you arrive and leave.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {actionCards.map((card) => (
                <Link key={card.href} href={card.href} className="group rounded-[1.5rem] border border-black/10 bg-white/80 p-5 transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                  </div>
                  <p className="mt-5 text-base font-semibold tracking-tight text-foreground">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="ink-panel p-6 sm:p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-primary">
              <QrCode className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">Desk QR workflow</h2>
            <p className="mt-3 text-sm leading-6 text-white/68">
              Attendance is tied to the physical desk, so scanning the desk code is the final step in the booking flow.
            </p>
            <div className="mt-6 space-y-4">
              {[
                'Reserve the desk you want before office day.',
                'Scan the QR code on arrival to check in.',
                'Scan the same QR code when leaving to check out.',
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary text-sm font-semibold text-black">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-white/68">{item}</p>
                </div>
              ))}
            </div>
            {todayBookings.length > 0 && (
              <div className="mt-6 rounded-[1.5rem] border border-primary/30 bg-primary/12 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">Today&apos;s desk</p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {todayBookings.map((booking) => booking.deskName ?? booking.deskId).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.18fr,0.82fr]">
          <div className="shell-panel p-6">
            <div className="flex flex-col gap-4 border-b border-black/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Today&apos;s bookings</h2>
                <p className="mt-1 text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <Badge variant="secondary" className="w-fit rounded-full bg-primary/10 px-3 py-1 text-foreground">
                {todayBookings.length} booking{todayBookings.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {todayBookings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="mx-auto mb-4 h-10 w-10 text-primary/70" />
                <p className="text-lg font-semibold tracking-tight text-foreground">No booking for today</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Reserve a desk before you head in, then use the QR code on the desk to confirm arrival.
                </p>
                <Button asChild className="mt-6 rounded-full">
                  <Link href="/book">Book a Desk</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {todayBookings.map((booking) => (
                  <div key={booking.id} className="rounded-[1.5rem] border border-black/10 bg-muted/40 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold tracking-tight text-foreground">
                            {booking.deskName ?? booking.deskId}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {booking.roomName ?? 'Office desk'} / {booking.duration}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={booking.status === 'checked_in' ? 'default' : 'outline'}
                        className="w-fit rounded-full px-3 py-1"
                      >
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="shell-panel p-6">
            <div className="flex items-center justify-between border-b border-black/8 pb-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Upcoming bookings</h2>
                <p className="mt-1 text-sm text-muted-foreground">What&apos;s next on your desk schedule</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/mybookings" className="flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {upcomingBookings.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No upcoming bookings</p>
            ) : (
              <div className="mt-6 space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="rounded-[1.5rem] border border-black/10 bg-white/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold tracking-tight text-foreground">
                          {format(booking.date, 'EEE, MMM d')}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {booking.deskName ?? booking.deskId} / {booking.duration}
                        </p>
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
