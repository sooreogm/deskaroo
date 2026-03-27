
import React from 'react';
import { DeskUtility } from '@/types';
import { Monitor, Laptop, BatteryCharging, ArrowUpDown, Armchair, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeskUtilityIconProps {
  utility: DeskUtility;
  className?: string;
}

export const DeskUtilityIcon = ({ utility, className }: DeskUtilityIconProps) => {
  const iconSize = 16;
  const iconClass = cn(
    'transition-colors',
    utility.available ? 'text-green-600' : 'text-gray-400',
    className
  );

  const quantity = utility.quantity && utility.quantity > 1 ? `×${utility.quantity}` : '';

  switch (utility.type) {
    case 'monitor':
      return (
        <div className="flex items-center">
          <Monitor size={iconSize} className={iconClass} />
          {quantity && <span className="ml-1 text-xs">{quantity}</span>}
        </div>
      );
    case 'dockingStation':
      return (
        <div className="flex items-center">
          <Laptop size={iconSize} className={iconClass} />
          {quantity && <span className="ml-1 text-xs">{quantity}</span>}
        </div>
      );
    case 'charger':
      return (
        <div className="flex items-center">
          <BatteryCharging size={iconSize} className={iconClass} />
          {quantity && <span className="ml-1 text-xs">{quantity}</span>}
        </div>
      );
    case 'adjustableHeight':
      return (
        <div className="flex items-center">
          <ArrowUpDown size={iconSize} className={iconClass} />
          {quantity && <span className="ml-1 text-xs">{quantity}</span>}
        </div>
      );
    case 'ergonomicChair':
      return (
        <div className="flex items-center">
          <Armchair size={iconSize} className={iconClass} />
          {quantity && <span className="ml-1 text-xs">{quantity}</span>}
        </div>
      );
    case 'headsetHook':
      return (
        <div className="flex items-center">
          <Headphones size={iconSize} className={iconClass} />
          {quantity && <span className="ml-1 text-xs">{quantity}</span>}
        </div>
      );
    default:
      return null;
  }
};

interface DeskUtilitiesListProps {
  utilities: DeskUtility[];
  className?: string;
}

const DeskUtilitiesList = ({ utilities, className }: DeskUtilitiesListProps) => {
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
          <DeskUtilityIcon utility={utility} />
        </div>
      ))}
    </div>
  );
};

export default DeskUtilitiesList;
