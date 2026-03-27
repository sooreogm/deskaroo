
import { format } from 'date-fns';
import { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getBookingTimeDisplay } from '@/utils/bookingHelpers';

interface CancelDialogProps {
  open: boolean;
  booking: Booking | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const CancelDialog = ({ open, booking, onOpenChange, onConfirm }: CancelDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white p-0 shadow-[0_32px_90px_-48px_rgba(0,0,0,0.35)] sm:max-w-md">
        <div className="p-6 sm:p-7">
        <DialogHeader className="space-y-3 text-left">
          <span className="page-eyebrow">Cancel Booking</span>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Remove this reservation?
          </DialogTitle>
          <DialogDescription>
            Cancelling this booking frees the desk for someone else. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {booking && (
          <div className="mt-6 rounded-[1.5rem] border border-black/10 bg-muted/40 p-4">
            <p className="font-medium text-foreground">{booking.deskName ?? 'Booked desk'}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-sm text-muted-foreground">{getBookingTimeDisplay(booking)}</p>
          </div>
        )}
        <DialogFooter className="mt-6 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" className="rounded-full border-black/10 bg-white/80" onClick={() => onOpenChange(false)}>
            Keep Booking
          </Button>
          <Button variant="destructive" className="rounded-full" onClick={onConfirm}>
            Yes, Cancel Booking
          </Button>
        </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;
