
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';

interface DatePickerFieldProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const DatePickerField = ({ date, onDateChange }: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="date">Date</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                onDateChange(newDate);
                setOpen(false);
              }
            }}
            initialFocus
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
