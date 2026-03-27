
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save,
  Trash,
  Plus,
  Minus,
  Square, 
  LayoutGrid,
  DoorOpen, 
  PanelLeftOpen,
  ChevronLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FloorPlanToolbarProps {
  onSave: () => void;
  onDelete: () => void;
  onAddDesk: (type: string) => void;
  onAddWall: () => void;
  onAddDoor: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomLevel: number;
  className?: string;
}

const FloorPlanToolbar = ({
  onSave,
  onDelete,
  onAddDesk,
  onAddWall,
  onAddDoor,
  onZoomIn,
  onZoomOut,
  zoomLevel,
  className
}: FloorPlanToolbarProps) => {
  const router = useRouter();

  return (
    <div className={cn("p-2 border-b flex items-center gap-2 bg-white", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => router.push('/dashboard')}
        title="Back to Dashboard"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Separator orientation="vertical" className="h-8" />
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSave}
        className="gap-1"
      >
        <Save className="h-4 w-4" /> Save
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDelete}
        className="gap-1 text-destructive"
      >
        <Trash className="h-4 w-4" /> Delete
      </Button>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddDesk('standard')}
        >
          <Square className="h-4 w-4 mr-1" /> Standard Desk
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddDesk('standing')}
        >
          <Square className="h-4 w-4 mr-1" /> Standing Desk
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddDesk('corner')}
        >
          <LayoutGrid className="h-4 w-4 mr-1" /> Corner Desk
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddWall}
      >
        <PanelLeftOpen className="h-4 w-4 mr-1" /> Add Wall
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onAddDoor}
      >
        <DoorOpen className="h-4 w-4 mr-1" /> Add Door
      </Button>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-1">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.5}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="text-sm font-medium w-12 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onZoomIn}
          disabled={zoomLevel >= 2}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FloorPlanToolbar;
