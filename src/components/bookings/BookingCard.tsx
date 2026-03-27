import { format } from 'date-fns';
import { CalendarDays, Clock3, Edit2, MapPin, MoreHorizontal, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Booking } from '@/types';
import { getBookingTimeDisplay } from '@/utils/bookingHelpers';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  canManage?: boolean;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (booking: Booking) => void;
}

const BookingCard = ({ booking, canManage = true, onEditBooking, onDeleteBooking }: BookingCardProps) => {
  const statusLabel = booking.status.replace('_', ' ');
  const statusClassName = {
    confirmed: 'border-primary/25 bg-primary/12 text-foreground',
    checked_in: 'border-black bg-black text-white',
    checked_out: 'border-black/10 bg-muted text-foreground',
    cancelled: 'border-destructive/20 bg-destructive/10 text-destructive',
    pending: 'border-black/10 bg-white text-foreground',
  }[booking.status] ?? 'border-black/10 bg-white text-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          'hover-scale shell-panel border-0 bg-white/90 shadow-none',
          booking.status === 'cancelled' && 'opacity-70'
        )}
      >
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className={cn('inline-flex rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]', statusClassName)}>
                {statusLabel}
              </div>
              <div>
                <CardTitle className="text-xl tracking-tight text-foreground">{booking.deskName ?? 'Booked desk'}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {booking.roomName ?? 'Office room'}
                </CardDescription>
              </div>
            </div>
            {canManage && booking.status !== 'cancelled' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-black/10 bg-white/90 text-foreground hover:bg-muted"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-2xl border-black/10 p-1 pointer-events-auto">
                  <DropdownMenuItem onClick={() => onEditBooking(booking)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteBooking(booking)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 rounded-[1.5rem] border border-black/10 bg-muted/40 p-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-3 h-4 w-4 text-primary" />
              {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock3 className="mr-3 h-4 w-4 text-primary" />
              {getBookingTimeDisplay(booking)}
            </div>
          </div>
        </CardContent>
        {canManage && booking.status !== 'cancelled' && (
          <CardFooter className="pt-1">
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full rounded-full border-black/10 bg-white/80 hover:border-primary hover:bg-primary/5"
              onClick={() => onEditBooking(booking)}
            >
              Modify Booking
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default BookingCard;
