import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import { useUserBookings, useCancelBooking } from '@/hooks/useBookings';
import BookingTabsContent from '@/components/bookings/BookingTabsContent';
import CancelDialog from '@/components/bookings/CancelDialog';
import { Loader2 } from 'lucide-react';
import { Booking } from '@/types';

const MyBookings = () => {
  const router = useRouter();
  const { data: bookings = [], isLoading } = useUserBookings();
  const cancelBookingMutation = useCancelBooking();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleEditBooking = (booking: Booking) => {
    router.push(`/book?deskId=${booking.deskId}&date=${booking.date.toISOString()}`);
  };

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      cancelBookingMutation.mutate(selectedBooking.id);
      setDeleteDialogOpen(false);
    }
  };

  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const activeBookings = bookings.filter((b) =>
    ['confirmed', 'checked_in'].includes(b.status) && new Date(b.date) >= today
  );
  const pastBookings = bookings.filter((b) =>
    ['confirmed', 'checked_in', 'checked_out'].includes(b.status) && new Date(b.date) < today
  );
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');
  const summaryCards = [
    { label: 'Active bookings', value: activeBookings.length, icon: CalendarDays },
    { label: 'Past bookings', value: pastBookings.length, icon: Clock3 },
    { label: 'Cancelled', value: cancelledBookings.length, icon: XCircle },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
        >
          <div>
            <span className="page-eyebrow">My Schedule</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your desk bookings at a glance
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Keep track of what&apos;s coming up, review past visits, and cancel reservations that you no longer need.
            </p>
          </div>
          <Button onClick={() => router.push('/book')} className="h-12 rounded-full px-6 text-sm font-semibold">
            Book New Desk
          </Button>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="shell-panel p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="shell-panel flex h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="shell-panel p-4 sm:p-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-1 rounded-[1.5rem] border border-black/10 bg-white/80 p-1 sm:grid-cols-3">
                <TabsTrigger
                  value="active"
                  className="min-h-[48px] rounded-[1.15rem] px-4 py-3 whitespace-normal data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  Active ({activeBookings.length})
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="min-h-[48px] rounded-[1.15rem] px-4 py-3 whitespace-normal data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  Past ({pastBookings.length})
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="min-h-[48px] rounded-[1.15rem] px-4 py-3 whitespace-normal data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  Cancelled ({cancelledBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                <BookingTabsContent bookings={activeBookings} type="active" onEditBooking={handleEditBooking} onDeleteBooking={handleDeleteBooking} />
              </TabsContent>
              <TabsContent value="past" className="mt-6">
                <BookingTabsContent bookings={pastBookings} type="past" onEditBooking={handleEditBooking} onDeleteBooking={handleDeleteBooking} />
              </TabsContent>
              <TabsContent value="cancelled" className="mt-6">
                <BookingTabsContent bookings={cancelledBookings} type="cancelled" onEditBooking={handleEditBooking} onDeleteBooking={handleDeleteBooking} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <CancelDialog open={deleteDialogOpen} booking={selectedBooking} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} />
    </AppLayout>
  );
};

export default MyBookings;
