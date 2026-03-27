
import { Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeOption {
  value: string;
  label: string;
}

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  hourOptions: TimeOption[];
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const TimeRangeSelector = ({ 
  startTime, 
  endTime, 
  hourOptions, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimeRangeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Select value={startTime} onValueChange={onStartTimeChange}>
          <SelectTrigger id="startTime">
            <SelectValue placeholder="Select start time" />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.slice(0, -1).map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                disabled={option.value >= endTime}
              >
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-2" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time</Label>
        <Select value={endTime} onValueChange={onEndTimeChange}>
          <SelectTrigger id="endTime">
            <SelectValue placeholder="Select end time" />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.slice(1).map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                disabled={option.value <= startTime}
              >
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-2" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeRangeSelector;
