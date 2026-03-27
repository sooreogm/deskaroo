
import React from 'react';
import { RoomUtility } from '@/types';
import { Wifi, Monitor, Clipboard, Phone, Wind, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomUtilityIconProps {
  utility: RoomUtility;
  className?: string;
}

export const RoomUtilityIcon = ({ utility, className }: RoomUtilityIconProps) => {
  const iconSize = 16;
  const iconClass = cn(
    'transition-colors',
    utility.available ? 'text-green-600' : 'text-gray-400',
    className
  );

  switch (utility.type) {
    case 'wifi':
      return <Wifi size={iconSize} className={iconClass} />;
    case 'projector':
      return <Monitor size={iconSize} className={iconClass} />;
    case 'whiteboard':
      return <Clipboard size={iconSize} className={iconClass} />;
    case 'conferencePhone':
      return <Phone size={iconSize} className={iconClass} />;
    case 'airConditioner':
      return <Wind size={iconSize} className={iconClass} />;
    case 'naturalLight':
      return <Sun size={iconSize} className={iconClass} />;
    default:
      return null;
  }
};

interface RoomUtilitiesListProps {
  utilities: RoomUtility[];
  className?: string;
}

const RoomUtilitiesList = ({ utilities, className }: RoomUtilitiesListProps) => {
  if (!utilities || utilities.length === 0) {
    return <span className="text-sm text-gray-500">No utilities</span>;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {utilities.map((utility, index) => (
        <div 
          key={`${utility.type}-${index}`}
          className="flex items-center"
          title={`${utility.type.charAt(0).toUpperCase() + utility.type.slice(1).replace(/([A-Z])/g, ' $1')} ${utility.available ? 'Available' : 'Not Available'}`}
        >
          <RoomUtilityIcon utility={utility} />
        </div>
      ))}
    </div>
  );
};

export default RoomUtilitiesList;
