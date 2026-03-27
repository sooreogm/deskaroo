
import React, { useState } from 'react';
import { FloorPlanObject as FloorPlanObjectType } from '@/types';
import { cn } from '@/lib/utils';
import ObjectControls from './object/ObjectControls';
import { getObjectStyle, getObjectLabel } from './object/objectStyles';

interface FloorPlanObjectProps {
  object: FloorPlanObjectType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Omit<FloorPlanObjectType, 'id'>>) => void;
  onDelete: () => void;
}

const FloorPlanObject = ({
  object,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}: FloorPlanObjectProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If not already selected, select this object
    if (!isSelected) {
      onSelect();
    }
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - object.x,
      y: e.clientY - object.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate new position with grid snapping (10px grid)
    const newX = Math.round((e.clientX - dragOffset.x) / 10) * 10;
    const newY = Math.round((e.clientY - dragOffset.y) / 10) * 10;
    
    onUpdate({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    
    const moveAmount = 10; // Move 10px at a time for precision
    
    switch(direction) {
      case 'up':
        onUpdate({ y: object.y - moveAmount });
        break;
      case 'down':
        onUpdate({ y: object.y + moveAmount });
        break;
      case 'left':
        onUpdate({ x: object.x - moveAmount });
        break;
      case 'right':
        onUpdate({ x: object.x + moveAmount });
        break;
    }
  };

  const styleClasses = getObjectStyle(object, isDragging, isSelected);

  return (
    <div 
      className={styleClasses}
      style={{
        left: `${object.x}px`,
        top: `${object.y}px`,
        width: `${object.width}px`,
        height: `${object.height}px`,
        transform: `rotate(${object.rotation}deg)`,
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="flex items-center justify-center h-full text-xs font-medium truncate">
        {getObjectLabel(object)}
      </div>
      
      {/* Controls that appear when selected */}
      {isSelected && (
        <>
          <ObjectControls 
            object={object}
            onMove={handleMove}
            onRotate={(e) => {
              e.stopPropagation();
              onUpdate({ rotation: (object.rotation + 90) % 360 });
            }}
            onDelete={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
          
          {/* Resize handle */}
          <div 
            className="absolute -m-1 w-3 h-3 bg-white border border-blue-500 rounded-full right-0 bottom-0 cursor-se-resize" 
            onMouseDown={(e) => {
              e.stopPropagation();
              // Resize logic would go here
            }}
          />
        </>
      )}
    </div>
  );
};

export default FloorPlanObject;
