
import { CheckIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookingDuration } from '@/types';

interface DurationSelectorProps {
  duration: BookingDuration;
  timeSlots: { label: string; value: BookingDuration }[];
  onDurationChange: (value: BookingDuration) => void;
}

const DurationSelector = ({ duration, timeSlots, onDurationChange }: DurationSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Duration</Label>
      <RadioGroup value={duration} onValueChange={(value) => onDurationChange(value as BookingDuration)}>
        {timeSlots.map((slot) => (
          <div key={slot.value} className="flex items-center space-x-2">
            <RadioGroupItem value={slot.value} id={slot.value} />
            <Label htmlFor={slot.value} className="cursor-pointer flex-1">
              {slot.label}
            </Label>
            {duration === slot.value && (
              <CheckIcon className="h-4 w-4 text-primary animate-scale-in" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default DurationSelector;
