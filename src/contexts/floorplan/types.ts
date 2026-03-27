
import { FloorPlan, FloorPlanObject, Room } from '@/types';

export interface FloorPlanContextType {
  floorPlan: FloorPlan | null;
  selectedObjectId: string | null;
  selectedObject: FloorPlanObject | null;
  zoomLevel: number;
  rooms: Room[];
  setFloorPlan: (floorPlan: FloorPlan | null) => void;
  setSelectedObjectId: (id: string | null) => void;
  handleSave: () => void;
  handleDelete: () => void;
  handleAddDesk: (type: string) => void;
  handleAddWall: () => void;
  handleAddDoor: () => void;
  handleUpdateObject: (objectId: string, updates: Partial<Omit<FloorPlanObject, 'id'>>) => void;
  handleDeleteObject: (objectId: string) => void;
  handleUpdateFloorPlan: (updates: Partial<FloorPlan>) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}
