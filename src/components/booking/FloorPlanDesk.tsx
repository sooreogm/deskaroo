
import { Desk, BookingDuration } from '@/types';
import { cn } from '@/lib/utils';
import DeskUtilitiesList from '@/components/icons/DeskUtilities';
import { ArrowUpDown, Clock } from 'lucide-react';
import MapPin from '@/components/icons/MapPin';

interface FloorPlanDeskProps {
  desk: Desk;
  scale: number;
  isBooked: boolean;
  bookingDuration: BookingDuration | null;
  isHovered: boolean;
  isSelected: boolean;
  onDeskSelect: (deskId: string) => void;
  onHover: (deskId: string | null) => void;
}

const FloorPlanDesk = ({ 
  desk, 
  scale, 
  isBooked, 
  bookingDuration,
  isHovered, 
  isSelected, 
  onDeskSelect, 
  onHover 
}: FloorPlanDeskProps) => {
  
  const getStatusClass = (desk: Desk) => {
    if (isSelected) return 'desk-selected';
    if (isBooked || desk.status === 'booked') return 'desk-booked';
    if (desk.status === 'maintenance') return 'bg-yellow-100 border-2 border-yellow-300';
    return 'desk-available';
  };

  // Get booking duration indicator
  const getBookingDurationIndicator = () => {
    if (!isBooked || !bookingDuration) return null;
    
    // Colors for different booking durations
    const durationColors: Record<BookingDuration, { bg: string, text: string, label: string }> = {
      'full-day': { bg: 'bg-red-100', text: 'text-red-700', label: 'Full day' },
      'morning': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'AM' },
      'afternoon': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'PM' },
      'custom': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Custom' }
    };
    
    const colors = durationColors[bookingDuration];
    
    return (
      <div className={`absolute -top-2 -left-2 ${colors.bg} rounded-full p-0.5 px-1 text-[9px] font-medium ${colors.text} border`}>
        <span className="flex items-center">
          <Clock className="h-2 w-2 mr-0.5" />
          {colors.label}
        </span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "desk absolute flex items-center justify-center",
        getStatusClass(desk),
        isHovered && !isBooked ? "shadow-md scale-105" : ""
      )}
      style={{
        width: '50px',
        height: '30px',
        left: `${desk.position.x * scale}px`,
        top: `${desk.position.y * scale}px`,
        transform: isHovered || isSelected ? 'scale(1.1)' : 'scale(1)',
        cursor: isBooked ? 'not-allowed' : 'pointer',
        zIndex: isHovered || isSelected ? 10 : 2
      }}
      onClick={() => !isBooked && desk.status === 'available' && onDeskSelect(desk.id)}
      onMouseEnter={() => onHover(desk.id)}
      onMouseLeave={() => onHover(null)}
    >
      <span className="text-xs font-medium truncate max-w-[40px]">{desk.name}</span>
      
      {/* Booking duration indicator */}
      {getBookingDurationIndicator()}
      
      {/* Standing desk indicator */}
      {desk.type === 'standing' && (
        <div className="absolute -top-2 -right-2 bg-blue-100 rounded-full p-0.5">
          <ArrowUpDown className="h-3 w-3 text-blue-600" />
        </div>
      )}
      
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20 glassmorphism rounded-md px-3 py-2 text-xs whitespace-nowrap bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md min-w-[180px]">
          <div className="font-medium text-sm mb-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" /> {desk.name}
          </div>
          
          {desk.type && (
            <div className="mb-1 text-gray-600 flex items-center">
              {desk.type === 'standing' && <ArrowUpDown className="h-3 w-3 mr-1" />}
              {desk.type.charAt(0).toUpperCase() + desk.type.slice(1)} Desk
            </div>
          )}
          
          {desk.utilities && desk.utilities.length > 0 && (
            <div className="mt-1">
              <div className="text-gray-600 text-xs mb-1">Utilities:</div>
              <DeskUtilitiesList utilities={desk.utilities} />
            </div>
          )}
          
          {/* Status with booking duration */}
          <div className={cn(
            "mt-1 text-xs font-medium",
            isBooked || desk.status === 'booked' ? "text-red-600" : 
            desk.status === 'maintenance' ? "text-yellow-600" : "text-green-600"
          )}>
            {isBooked || desk.status === 'booked' ? (
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {bookingDuration === 'full-day' && "Booked (Full Day)"}
                {bookingDuration === 'morning' && "Booked (Morning)"}
                {bookingDuration === 'afternoon' && "Booked (Afternoon)"}
                {bookingDuration === 'custom' && "Booked (Custom Hours)"}
                {!bookingDuration && "Booked"}
              </div>
            ) : desk.status === 'maintenance' ? "Under Maintenance" : "Available"}
          </div>
          
          <div className="absolute w-2 h-2 bg-white rotate-45 -bottom-1 left-1/2 transform -translate-x-1/2 border-r border-b border-gray-200"></div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanDesk;
