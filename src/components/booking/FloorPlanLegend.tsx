
import { Desk } from '@/types';
import { Clock } from 'lucide-react';

interface FloorPlanLegendProps {
  roomDesks: Desk[];
  isDeskBooked: (deskId: string) => boolean;
}

const FloorPlanLegend = ({ roomDesks, isDeskBooked }: FloorPlanLegendProps) => {
  // Count total, available and booked desks
  const totalDesks = roomDesks.length;
  const bookedDesks = roomDesks.filter(desk => isDeskBooked(desk.id)).length;
  const availableDesks = totalDesks - bookedDesks;
  
  return (
    <div className="p-3 border-t border-gray-200 bg-gray-50 text-sm">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Available ({availableDesks})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Booked ({bookedDesks})</span>
          </div>
        </div>
        
        {/* Booking duration legend */}
        <div className="flex flex-wrap gap-2 mt-1 md:mt-0">
          <div className="text-xs text-gray-500">Booking Types:</div>
          <div className="flex items-center text-xs">
            <span className="inline-flex items-center bg-red-100 text-red-700 px-1.5 rounded text-[10px]">
              <Clock className="h-2 w-2 mr-0.5" />
              Full day
            </span>
          </div>
          <div className="flex items-center text-xs">
            <span className="inline-flex items-center bg-amber-100 text-amber-700 px-1.5 rounded text-[10px]">
              <Clock className="h-2 w-2 mr-0.5" />
              AM
            </span>
          </div>
          <div className="flex items-center text-xs">
            <span className="inline-flex items-center bg-orange-100 text-orange-700 px-1.5 rounded text-[10px]">
              <Clock className="h-2 w-2 mr-0.5" />
              PM
            </span>
          </div>
          <div className="flex items-center text-xs">
            <span className="inline-flex items-center bg-purple-100 text-purple-700 px-1.5 rounded text-[10px]">
              <Clock className="h-2 w-2 mr-0.5" />
              Custom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanLegend;
