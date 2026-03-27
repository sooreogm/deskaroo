import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarIcon, Check, Clock, Loader2, MapPin, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/components/layout/AppLayout';
import { useBookingsByDate, useCreateBooking } from '@/hooks/useBookings';
import { useDesks } from '@/hooks/useDesks';
import { useRooms } from '@/hooks/useRooms';
import { cn } from '@/lib/utils';
import { BookingDuration, TimeSlot } from '@/types';

const STEPS = [
  { label: 'Select Desk', description: 'Choose a room and workspace' },
  { label: 'Select Time', description: 'Choose date and duration' },
  { label: 'Confirm', description: 'Review before booking' },
];

const durationOptions = [
  { value: 'full-day', label: 'Full Day', desc: '9:00 AM - 5:00 PM' },
  { value: 'morning', label: 'Morning', desc: '9:00 AM - 1:00 PM' },
  { value: 'afternoon', label: 'Afternoon', desc: '1:00 PM - 5:00 PM' },
  { value: 'custom', label: 'Custom', desc: 'Choose a time range' },
] as const;

const BookDesk = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState<BookingDuration>('full-day');
  const [timeStart, setTimeStart] = useState<string>('09:00');
  const [timeEnd, setTimeEnd] = useState<string>('17:00');

  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const { data: desks = [], isLoading: desksLoading } = useDesks(selectedRoomId ?? undefined);
  const { data: dateBookings = [] } = useBookingsByDate(selectedDate);
  const createBooking = useCreateBooking();

  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  const bookedDeskIds = dateBookings.map((booking) => booking.deskId);
  const selectedDesk = desks.find((desk) => desk.id === selectedDeskId);
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const hasValidCustomTime = duration !== 'custom' || timeStart < timeEnd;
  const canProceedStep0 = !!selectedDeskId;
  const canProceedStep1 = !!selectedDate && !!duration && hasValidCustomTime;
  const selectedDurationLabel = durationOptions.find((option) => option.value === duration)?.label ?? duration;

  const handleConfirm = () => {
    if (!selectedDeskId || !selectedRoomId) return;

    if (!hasValidCustomTime) {
      toast.error('End time must be after start time');
      return;
    }

    const booking: {
      deskId: string;
      roomId: string;
      date: Date;
      duration: BookingDuration;
      timeSlot?: TimeSlot;
    } = {
      deskId: selectedDeskId,
      roomId: selectedRoomId,
      date: selectedDate,
      duration,
    };

    if (duration === 'custom' && timeStart && timeEnd) {
      const start = new Date(selectedDate);
      const end = new Date(selectedDate);

      start.setHours(Number(timeStart.split(':')[0]), 0, 0, 0);
      end.setHours(Number(timeEnd.split(':')[0]), 0, 0, 0);
      booking.timeSlot = { start, end };
    }

    createBooking.mutate(booking, {
      onSuccess: () => {
        router.push('/mybookings');
      },
    });
  };

  const slideVariants = {
    enter: { x: 56, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -56, opacity: 0 },
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="page-eyebrow">Book a Desk</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Reserve your workspace in three clear steps
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Choose a room, pick a desk, set the time, and then use the QR code on that desk to check in when you arrive.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="h-11 rounded-full border-black/10 bg-white/80 px-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.16fr,0.84fr]">
          <div className="space-y-6">
            <div className="shell-panel p-3 sm:p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {STEPS.map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(
                      'rounded-[1.5rem] border px-4 py-4 transition-colors',
                      index === step
                        ? 'border-primary/30 bg-primary/10'
                        : index < step
                        ? 'border-black/10 bg-black text-white'
                        : 'border-black/10 bg-white/70'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold',
                          index === step
                            ? 'bg-primary text-black'
                            : index < step
                            ? 'bg-white text-black'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {index < step ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <p className={cn('text-sm font-semibold', index < step ? 'text-white' : 'text-foreground')}>
                          {item.label}
                        </p>
                        <p className={cn('text-xs', index < step ? 'text-white/65' : 'text-muted-foreground')}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24 }}
                >
                  <Card className="shell-panel border-0 bg-white/90 shadow-none">
                    <CardHeader className="pb-5">
                      <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                        <MapPin className="h-5 w-5 text-primary" />
                        Select a desk
                      </CardTitle>
                      <CardDescription>Choose the room you want and then pick an available desk.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-7">
                      <div>
                        <Label className="mb-3 block text-sm font-medium text-foreground">Room</Label>
                        {roomsLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                          <div className="flex flex-wrap gap-3">
                            {rooms.map((room) => (
                              <Button
                                key={room.id}
                                variant="outline"
                                className={cn(
                                  'h-11 rounded-full border-black/10 bg-white px-5 hover:border-primary hover:bg-primary/5',
                                  selectedRoomId === room.id && 'border-primary bg-primary/10 text-foreground'
                                )}
                                onClick={() => {
                                  setSelectedRoomId(room.id);
                                  setSelectedDeskId(null);
                                }}
                              >
                                {room.name}
                                <Badge variant="secondary" className="ml-2 rounded-full bg-black/5 text-foreground">
                                  {room.floor}F
                                </Badge>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="mb-3 block text-sm font-medium text-foreground">Desk</Label>
                        {desksLoading ? (
                          <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : desks.length === 0 ? (
                          <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-muted/30 px-6 py-12 text-center">
                            <p className="text-sm text-muted-foreground">No desks are configured for this room yet.</p>
                          </div>
                        ) : (
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {desks.map((desk) => {
                              const isBooked = bookedDeskIds.includes(desk.id);
                              const isSelected = selectedDeskId === desk.id;
                              const isMaintenance = desk.status === 'maintenance';
                              const isUnavailable = isBooked || isMaintenance;

                              return (
                                <button
                                  key={desk.id}
                                  disabled={isUnavailable}
                                  onClick={() => setSelectedDeskId(desk.id)}
                                  className={cn(
                                    'rounded-[1.5rem] border p-5 text-left transition',
                                    isUnavailable
                                      ? 'cursor-not-allowed border-black/10 bg-muted opacity-55'
                                      : isSelected
                                      ? 'border-primary bg-primary/10 shadow-[0_20px_50px_-36px_rgba(245,179,8,0.55)]'
                                      : 'border-black/10 bg-white hover:border-primary/35 hover:bg-primary/5'
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p className="text-base font-semibold tracking-tight text-foreground">{desk.name}</p>
                                      <p className="mt-1 text-sm capitalize text-muted-foreground">{desk.type ?? 'standard'}</p>
                                    </div>
                                    <div
                                      className={cn(
                                        'mt-1 h-3 w-3 rounded-full',
                                        isUnavailable ? 'bg-black/15' : isSelected ? 'bg-primary' : 'bg-black/10'
                                      )}
                                    />
                                  </div>

                                  <div className="mt-4">
                                    {isBooked && (
                                      <span className="inline-flex rounded-full border border-black/10 bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                        Booked
                                      </span>
                                    )}
                                    {!isBooked && isMaintenance && (
                                      <span className="inline-flex rounded-full border border-black/10 bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                                        Maintenance
                                      </span>
                                    )}
                                    {!isBooked && !isMaintenance && isSelected && (
                                      <span className="inline-flex rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                                        Selected
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24 }}
                >
                  <Card className="shell-panel border-0 bg-white/90 shadow-none">
                    <CardHeader className="pb-5">
                      <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                        <Clock className="h-5 w-5 text-primary" />
                        Select time
                      </CardTitle>
                      <CardDescription>Set the booking date and the time window you need.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-7">
                      <div>
                        <Label className="mb-3 block text-sm font-medium text-foreground">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-12 w-full justify-start rounded-2xl border-black/10 bg-white/80 text-left font-medium sm:w-[320px]"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                              {format(selectedDate, 'PPP')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto rounded-[1.5rem] border-black/10 p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                              className="pointer-events-auto p-3"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="mb-3 block text-sm font-medium text-foreground">Duration</Label>
                        <RadioGroup
                          value={duration}
                          onValueChange={(value) => setDuration(value as BookingDuration)}
                          className="grid gap-4 sm:grid-cols-2"
                        >
                          {durationOptions.map((option) => (
                            <label
                              key={option.value}
                              className={cn(
                                'rounded-[1.5rem] border p-5 transition',
                                duration === option.value
                                  ? 'border-primary bg-primary/10'
                                  : 'border-black/10 bg-white hover:border-primary/35 hover:bg-primary/5'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <RadioGroupItem value={option.value} className="mt-1" />
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{option.label}</p>
                                  <p className="mt-1 text-sm text-muted-foreground">{option.desc}</p>
                                </div>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>

                      {duration === 'custom' && (
                        <div className="rounded-[1.75rem] border border-black/10 bg-muted/35 p-5">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <Label className="mb-2 block text-sm font-medium text-foreground">Start time</Label>
                              <Select value={timeStart} onValueChange={setTimeStart}>
                                <SelectTrigger className="h-12 rounded-2xl border-black/10 bg-white/80">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-black/10">
                                  {Array.from({ length: 10 }, (_, index) => {
                                    const hour = index + 8;
                                    const value = `${hour.toString().padStart(2, '0')}:00`;
                                    return (
                                      <SelectItem key={value} value={value}>
                                        {value}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="mb-2 block text-sm font-medium text-foreground">End time</Label>
                              <Select value={timeEnd} onValueChange={setTimeEnd}>
                                <SelectTrigger className="h-12 rounded-2xl border-black/10 bg-white/80">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-black/10">
                                  {Array.from({ length: 10 }, (_, index) => {
                                    const hour = index + 9;
                                    const value = `${hour.toString().padStart(2, '0')}:00`;
                                    return (
                                      <SelectItem key={value} value={value}>
                                        {value}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {!hasValidCustomTime && (
                            <p className="mt-4 text-sm text-destructive">End time must be after start time.</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24 }}
                >
                  <Card className="shell-panel border-0 bg-white/90 shadow-none">
                    <CardHeader className="pb-5">
                      <CardTitle className="flex items-center gap-2 text-2xl tracking-tight">
                        <Check className="h-5 w-5 text-primary" />
                        Confirm booking
                      </CardTitle>
                      <CardDescription>Review the reservation details before you lock them in.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-[1.75rem] border border-black/10 bg-muted/35 p-5">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-sm text-muted-foreground">Room</span>
                            <span className="text-sm font-semibold text-foreground">{selectedRoom?.name ?? 'Choose a room'}</span>
                          </div>
                          <div className="h-px bg-black/8" />
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-sm text-muted-foreground">Desk</span>
                            <span className="text-sm font-semibold text-foreground">{selectedDesk?.name ?? 'Choose a desk'}</span>
                          </div>
                          <div className="h-px bg-black/8" />
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-sm text-muted-foreground">Date</span>
                            <span className="text-sm font-semibold text-foreground">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                          <div className="h-px bg-black/8" />
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-sm text-muted-foreground">Duration</span>
                            <span className="text-sm font-semibold text-foreground">{selectedDurationLabel}</span>
                          </div>
                          {duration === 'custom' && (
                            <>
                              <div className="h-px bg-black/8" />
                              <div className="flex items-center justify-between gap-6">
                                <span className="text-sm text-muted-foreground">Time</span>
                                <span className="text-sm font-semibold text-foreground">
                                  {timeStart} - {timeEnd}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="shell-panel flex items-center justify-between p-4">
              <Button
                variant="outline"
                onClick={() => setStep((current) => current - 1)}
                disabled={step === 0}
                className="rounded-full border-black/10 bg-white/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {step < 2 ? (
                <Button
                  onClick={() => setStep((current) => current + 1)}
                  disabled={step === 0 ? !canProceedStep0 : !canProceedStep1}
                  className="rounded-full px-5"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleConfirm} disabled={createBooking.isPending} className="rounded-full px-5">
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="ink-panel h-fit p-6 sm:p-8 xl:sticky xl:top-10">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-primary">
              <QrCode className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">Booking summary</h2>
            <p className="mt-3 text-sm leading-6 text-white/68">
              Once you confirm the booking, scan the QR code attached to the desk when you arrive and again when you leave.
            </p>

            <div className="mt-6 space-y-4">
              {[
                { label: 'Room', value: selectedRoom?.name ?? 'Choose a room' },
                { label: 'Desk', value: selectedDesk?.name ?? 'Choose a desk' },
                { label: 'Date', value: format(selectedDate, 'PPP') },
                { label: 'Duration', value: duration === 'custom' ? `${timeStart} - ${timeEnd}` : selectedDurationLabel },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/42">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-primary/25 bg-primary/12 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">How it works</p>
              <p className="mt-2 text-sm leading-6 text-white/88">
                Desks are checked in and out with the QR code on the physical desk, so choose the workspace you actually plan to sit at.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BookDesk;
