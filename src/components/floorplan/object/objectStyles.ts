
import { FloorPlanObject } from '@/types';
import { cn } from '@/lib/utils';

// Generate the appropriate CSS classes for a floor plan object
export const getObjectStyle = (
  object: FloorPlanObject, 
  isDragging: boolean, 
  isSelected: boolean
): string => {
  let className = "floor-plan-object absolute";
  let backgroundColor = "bg-gray-200";
  let borderColor = "border-gray-400";
  
  switch(object.type) {
    case 'desk': {
      const deskType = object.properties?.type || 'standard';
      
      if (deskType === 'standing') {
        backgroundColor = "bg-blue-100";
        borderColor = "border-blue-400";
      } else if (deskType === 'corner') {
        backgroundColor = "bg-purple-100";
        borderColor = "border-purple-400";
      } else {
        backgroundColor = "bg-green-100";
        borderColor = "border-green-400";
      }
      break;
    }
      
    case 'wall':
      backgroundColor = "bg-gray-700";
      borderColor = "border-gray-800";
      break;
      
    case 'door':
      backgroundColor = "bg-amber-100";
      borderColor = "border-amber-400";
      break;
      
    case 'window':
      backgroundColor = "bg-sky-100";
      borderColor = "border-sky-400";
      break;
  }
  
  return cn(
    className,
    backgroundColor,
    `border-2 ${borderColor}`,
    isSelected && "ring-2 ring-blue-500",
    isDragging && "cursor-grabbing",
    !isDragging && "cursor-grab"
  );
};

// Get a human-readable label for the object
export const getObjectLabel = (object: FloorPlanObject): string => {
  if (object.type === 'desk') {
    const deskType = object.properties?.type || 'standard';
    return `${deskType.charAt(0).toUpperCase() + deskType.slice(1)} Desk`;
  }
  
  return object.type.charAt(0).toUpperCase() + object.type.slice(1);
};
