import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2, LogIn, LogOut, Loader2, QrCode, ScanLine, XCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Booking } from '@/types';
import { fetchBookings, fetchDesks, updateBookingStatusRequest } from '@/lib/api';
import { cn } from '@/lib/utils';

const CheckIn = () => {
  const searchParams = useSearchParams();
  const deskId = searchParams.get('desk');
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [deskName, setDeskName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user || !deskId) {
      setLoading(false);
      return;
    }
    fetchBooking();
  }, [user, deskId]);

  const fetchBooking = () => {
    const today = new Date();
    Promise.all([fetchBookings({ userId: user!.id, deskId: deskId!, date: today }), fetchDesks()])
      .then(([bookings, desks]) => {
        const desk = desks.find((item) => item.id === deskId!);
        if (desk) {
          setDeskName(desk.name);
        }

        const nextBooking =
          bookings.find((item) => ['confirmed', 'checked_in', 'checked_out'].includes(item.status)) ?? null;

        if (nextBooking?.deskName) {
          setDeskName(nextBooking.deskName);
        }

        setBooking(nextBooking);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const updatedBooking = await updateBookingStatusRequest(booking.id, 'checked_in');
      toast.success('Checked in successfully!');
      setBooking(updatedBooking);
    } catch {
      toast.error('Failed to check in');
    }
    setActionLoading(false);
  };

  const handleCheckOut = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const updatedBooking = await updateBookingStatusRequest(booking.id, 'checked_out');
      toast.success('Checked out successfully!');
      setBooking(updatedBooking);
    } catch {
      toast.error('Failed to check out');
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="shell-panel mx-auto mt-20 flex max-w-md items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!deskId) {
    return (
      <AppLayout>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.08fr,0.92fr]">
          <div className="shell-panel p-6 sm:p-8">
            <span className="page-eyebrow">Desk QR</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Scan the QR code on your desk
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              This page needs the desk identifier from a scanned QR code so Deskaroo knows which physical desk you are checking in to or out of.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-black/10 bg-muted/40 p-5">
                <p className="text-sm font-semibold text-foreground">When you arrive</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Scan the desk QR code after you get to the workspace you booked for the day.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-black/10 bg-muted/40 p-5">
                <p className="text-sm font-semibold text-foreground">When you leave</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Scan the same QR code again so your booking is checked out correctly.
                </p>
              </div>
            </div>

            <Button onClick={() => router.push('/dashboard')} variant="outline" className="mt-8 rounded-full border-black/10 bg-white/80">
              Back to Dashboard
            </Button>
          </div>

          <div className="ink-panel p-6 sm:p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-primary">
              <QrCode className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">Why the QR matters</h2>
            <div className="mt-6 space-y-4">
              {[
                'Each desk has its own QR code.',
                'Scanning ties your booking to the exact desk you reserved.',
                'The same code handles both check-in and check-out.',
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
      </AppLayout>
    );
  }

  if (!booking) {
    return (
      <AppLayout>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.08fr,0.92fr]">
          <div className="shell-panel p-6 sm:p-8">
            <span className="page-eyebrow">No Booking Found</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              There&apos;s nothing to check in right now
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              You don&apos;t have a booking for {deskName || 'this desk'} today. Book a desk first, then scan the code again when you arrive.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-muted/40 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-black p-3 text-white">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{deskName || 'Unassigned desk'}</p>
                  <p className="text-sm text-muted-foreground">No active booking for today</p>
                </div>
              </div>
            </div>

            <Button onClick={() => router.push('/book')} className="mt-8 rounded-full px-6">
              Book a Desk
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="ink-panel p-6 sm:p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-primary">
              <ScanLine className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">
              Check-in only works with a matching booking
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/68">
              Booking and QR scanning are linked together so the office can track the right desk usage and free desks when people leave.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stateConfig = booking.status === 'checked_out'
    ? {
        title: 'Checked out',
        description: `Your session at ${deskName} is complete.`,
        icon: CheckCircle2,
        iconClassName: 'bg-white text-black',
      }
    : booking.status === 'checked_in'
    ? {
        title: 'Checked in',
        description: `You're currently checked in at ${deskName}.`,
        icon: CheckCircle2,
        iconClassName: 'bg-primary text-black',
      }
    : {
        title: 'Ready to check in',
        description: `Desk: ${deskName}`,
        icon: LogIn,
        iconClassName: 'bg-primary text-black',
      };

  return (
    <AppLayout>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.08fr,0.92fr]">
        <div className="shell-panel p-6 sm:p-8">
          <span className="page-eyebrow">Desk QR</span>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {stateConfig.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {stateConfig.description}
              </p>
            </div>
            <div className={cn('flex h-14 w-14 items-center justify-center rounded-[1.25rem]', stateConfig.iconClassName)}>
              <stateConfig.icon className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/10 bg-muted/40 p-5">
              <p className="text-sm text-muted-foreground">Desk</p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">{deskName || 'Assigned desk'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-black/10 bg-muted/40 p-5">
              <p className="text-sm text-muted-foreground">Booking status</p>
              <div className="mt-2 inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                {booking.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {booking.status === 'confirmed' && (
              <Button onClick={handleCheckIn} disabled={actionLoading} className="h-12 w-full rounded-full" size="lg">
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Check In
              </Button>
            )}
            {booking.status === 'checked_in' && (
              <Button
                onClick={handleCheckOut}
                disabled={actionLoading}
                variant="outline"
                className="h-12 w-full rounded-full border-black/10 bg-white/80"
                size="lg"
              >
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                Check Out
              </Button>
            )}
            {booking.status === 'checked_out' && (
              <Button onClick={() => router.push('/mybookings')} className="h-12 w-full rounded-full">
                View My Bookings
              </Button>
            )}
          </div>
        </div>

        <div className="ink-panel p-6 sm:p-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-primary">
            <QrCode className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">How scanning works</h2>
          <div className="mt-6 space-y-4">
            {[
              'Scan the desk code when you sit down.',
              'Your booking changes to checked in.',
              'Scan the same code when you leave to complete the booking.',
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
    </AppLayout>
  );
};

export default CheckIn;
