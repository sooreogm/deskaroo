
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FloorPlan, FloorPlanObject, Room } from '@/types';
import { getFloorPlanById } from '@/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Import our new modules
import { FloorPlanContextType } from './floorplan/types';
import { useFloorPlanActions } from './floorplan/useFloorPlanActions';
import { useZoom } from './floorplan/useZoom';

const FloorPlanContext = createContext<FloorPlanContextType | undefined>(undefined);

export const useFloorPlan = () => {
  const context = useContext(FloorPlanContext);
  if (!context) {
    throw new Error('useFloorPlan must be used within a FloorPlanProvider');
  }
  return context;
};

interface FloorPlanProviderProps {
  floorPlanId: string | undefined;
  rooms: Room[];
  children: ReactNode;
}

export const FloorPlanProvider: React.FC<FloorPlanProviderProps> = ({ 
  floorPlanId, 
  rooms, 
  children 
}) => {
  const router = useRouter();
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<FloorPlanObject | null>(null);
  
  // Use our custom hooks
  const { zoomLevel, handleZoomIn, handleZoomOut } = useZoom(1);
  const { 
    handleSave, 
    handleDelete, 
    handleAddDesk, 
    handleAddWall, 
    handleAddDoor, 
    handleUpdateObject, 
    handleDeleteObject, 
    handleUpdateFloorPlan 
  } = useFloorPlanActions(floorPlan, setFloorPlan, selectedObjectId, setSelectedObjectId);

  useEffect(() => {
    if (floorPlanId) {
      const plan = getFloorPlanById(floorPlanId);
      if (plan) {
        setFloorPlan(plan);
      } else {
        toast.error('Floor plan not found');
        router.push('/floor-plans');
      }
    }
  }, [floorPlanId, router]);

  useEffect(() => {
    if (floorPlan && selectedObjectId) {
      const object = floorPlan.objects.find(obj => obj.id === selectedObjectId);
      setSelectedObject(object || null);
    } else {
      setSelectedObject(null);
    }
  }, [floorPlan, selectedObjectId]);

  const value = {
    floorPlan,
    selectedObjectId,
    selectedObject,
    zoomLevel,
    rooms,
    setFloorPlan,
    setSelectedObjectId,
    handleSave,
    handleDelete,
    handleAddDesk,
    handleAddWall,
    handleAddDoor,
    handleUpdateObject,
    handleDeleteObject,
    handleUpdateFloorPlan,
    handleZoomIn,
    handleZoomOut
  };

  return (
    <FloorPlanContext.Provider value={value}>
      {children}
    </FloorPlanContext.Provider>
  );
};
