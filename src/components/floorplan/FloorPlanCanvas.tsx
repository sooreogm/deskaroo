
import React, { useRef, useState, useEffect } from 'react';
import { FloorPlan, FloorPlanObject } from '@/types';
import { cn } from '@/lib/utils';
import FloorPlanObjectComponent from './FloorPlanObject';

interface FloorPlanCanvasProps {
  floorPlan: FloorPlan;
  selectedObjectId: string | null;
  zoomLevel: number;
  onSelectObject: (objectId: string | null) => void;
  onUpdateObject: (objectId: string, updates: Partial<Omit<FloorPlanObject, 'id'>>) => void;
  onDeleteObject: (objectId: string) => void;
  className?: string;
}

const FloorPlanCanvas = ({
  floorPlan,
  selectedObjectId,
  zoomLevel,
  onSelectObject,
  onUpdateObject,
  onDeleteObject,
  className
}: FloorPlanCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  // Handle pan/drag functionality
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only pan when clicking on the canvas background, not on objects
      if ((e.target as HTMLElement).closest('.floor-plan-object')) return;
      
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      setCanvasPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, canvasPosition]);

  // Handle clicking outside objects to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect when clicking directly on the canvas, not on objects
    if (!(e.target as HTMLElement).closest('.floor-plan-object')) {
      onSelectObject(null);
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden border rounded-md bg-gray-50", 
        isDragging && "cursor-grabbing",
        !isDragging && "cursor-grab",
        className
      )}
      onClick={handleCanvasClick}
    >
      <div 
        ref={canvasRef}
        className="absolute"
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoomLevel})`,
          width: `${floorPlan.width}px`,
          height: `${floorPlan.height}px`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 bg-white">
          <svg 
            width="100%" 
            height="100%" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern 
                id="grid" 
                width="20" 
                height="20" 
                patternUnits="userSpaceOnUse"
              >
                <path 
                  d="M 20 0 L 0 0 0 20" 
                  fill="none" 
                  stroke="rgba(0,0,0,0.1)" 
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floor plan objects */}
        {floorPlan.objects.map(object => (
          <FloorPlanObjectComponent
            key={object.id}
            object={object}
            isSelected={selectedObjectId === object.id}
            onSelect={() => onSelectObject(object.id)}
            onUpdate={(updates) => onUpdateObject(object.id, updates)}
            onDelete={() => onDeleteObject(object.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FloorPlanCanvas;
