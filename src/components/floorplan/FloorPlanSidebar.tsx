import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Room, FloorPlan, FloorPlanObject } from '@/types';

interface FloorPlanSidebarProps {
  rooms: Room[];
  currentFloorPlan: FloorPlan;
  selectedObject: FloorPlanObject | null;
  onUpdateFloorPlan: (updates: Partial<FloorPlan>) => void;
  onUpdateObject: (objectId: string, updates: Partial<Omit<FloorPlanObject, 'id'>>) => void;
  onDeleteObject: (objectId: string) => void;
  className?: string;
}

const FloorPlanSidebar = ({
  rooms,
  currentFloorPlan,
  selectedObject,
  onUpdateFloorPlan,
  onUpdateObject,
  onDeleteObject,
  className
}: FloorPlanSidebarProps) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Floor Plan Settings</CardTitle>
          <CardDescription>
            Configure floor plan properties
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floor-plan-name">Floor Plan Name</Label>
            <Input 
              id="floor-plan-name" 
              value={currentFloorPlan.name}
              onChange={(e) => onUpdateFloorPlan({ name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="floor-plan-width">Width (px)</Label>
              <Input 
                id="floor-plan-width" 
                type="number"
                value={currentFloorPlan.width}
                onChange={(e) => onUpdateFloorPlan({ width: parseInt(e.target.value) || 800 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floor-plan-height">Height (px)</Label>
              <Input 
                id="floor-plan-height" 
                type="number"
                value={currentFloorPlan.height}
                onChange={(e) => onUpdateFloorPlan({ height: parseInt(e.target.value) || 600 })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="floor-plan-room">Room</Label>
            <select 
              id="floor-plan-room"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={currentFloorPlan.roomId}
              onChange={(e) => onUpdateFloorPlan({ roomId: e.target.value })}
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} (Floor {room.floor})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
      
      {selectedObject && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Object Properties</CardTitle>
            <CardDescription>
              Edit selected object properties
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="object-x">X Position</Label>
                <Input 
                  id="object-x" 
                  type="number"
                  value={selectedObject.x}
                  onChange={(e) => onUpdateObject(selectedObject.id, { x: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="object-y">Y Position</Label>
                <Input 
                  id="object-y" 
                  type="number"
                  value={selectedObject.y}
                  onChange={(e) => onUpdateObject(selectedObject.id, { y: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="object-width">Width</Label>
                <Input 
                  id="object-width" 
                  type="number"
                  value={selectedObject.width}
                  onChange={(e) => onUpdateObject(selectedObject.id, { width: parseInt(e.target.value) || 50 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="object-height">Height</Label>
                <Input 
                  id="object-height" 
                  type="number"
                  value={selectedObject.height}
                  onChange={(e) => onUpdateObject(selectedObject.id, { height: parseInt(e.target.value) || 50 })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="object-rotation">Rotation (degrees)</Label>
              <Input 
                id="object-rotation" 
                type="number"
                value={selectedObject.rotation}
                onChange={(e) => onUpdateObject(selectedObject.id, { rotation: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            {selectedObject.type === 'desk' && (
              <div className="space-y-2">
                <Label htmlFor="desk-type">Desk Type</Label>
                <select 
                  id="desk-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedObject.properties?.type || 'standard'}
                  onChange={(e) => onUpdateObject(selectedObject.id, { 
                    properties: { ...selectedObject.properties, type: e.target.value } 
                  })}
                >
                  <option value="standard">Standard</option>
                  <option value="standing">Standing</option>
                  <option value="corner">Corner</option>
                  <option value="huddle">Huddle</option>
                </select>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => onDeleteObject(selectedObject.id)}
            >
              Delete Object
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FloorPlanSidebar;
