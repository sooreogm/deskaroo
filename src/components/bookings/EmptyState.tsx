
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarDays, Clock3, XCircle } from 'lucide-react';

interface EmptyStateProps {
  type: 'active' | 'past' | 'cancelled';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const router = useRouter();
  
  let message = '';
  let showButton = false;
  let title = '';
  let Icon = CalendarDays;
  
  switch (type) {
    case 'active':
      title = 'No active bookings';
      message = 'You have no active bookings';
      showButton = true;
      break;
    case 'past':
      title = 'Nothing in your history yet';
      message = 'You have no past bookings';
      Icon = Clock3;
      break;
    case 'cancelled':
      title = 'No cancelled bookings';
      message = 'You have no cancelled bookings';
      Icon = XCircle;
      break;
  }
  
  return (
    <div className="shell-panel flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="rounded-[1.5rem] bg-primary/10 p-4 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{message}</p>
      {showButton && (
        <Button variant="outline" className="mt-6 rounded-full border-black/10 bg-white/80" onClick={() => router.push('/book')}>
          Book a Desk
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
