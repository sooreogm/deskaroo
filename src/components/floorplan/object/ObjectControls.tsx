
import React from 'react';
import { 
  Trash2, 
  RotateCw, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { FloorPlanObject } from '@/types';

interface ObjectControlsProps {
  object: FloorPlanObject;
  onMove: (direction: 'up' | 'down' | 'left' | 'right', e: React.MouseEvent) => void;
  onRotate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ObjectControls = ({ object, onMove, onRotate, onDelete }: ObjectControlsProps) => {
  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex bg-white border rounded-md shadow-sm z-20">
      <button 
        className="p-1 hover:bg-gray-100"
        onClick={(e) => onMove('up', e)}
        title="Move up"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <button 
        className="p-1 hover:bg-gray-100"
        onClick={(e) => onMove('down', e)}
        title="Move down"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
      <button 
        className="p-1 hover:bg-gray-100"
        onClick={(e) => onMove('left', e)}
        title="Move left"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button 
        className="p-1 hover:bg-gray-100"
        onClick={(e) => onMove('right', e)}
        title="Move right"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
      <button 
        className="p-1 hover:bg-gray-100"
        onClick={onRotate}
        title="Rotate"
      >
        <RotateCw className="h-4 w-4" />
      </button>
      <button 
        className="p-1 hover:bg-gray-100 text-red-500"
        onClick={onDelete}
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ObjectControls;
