
import { useState } from 'react';
import { FloorPlan, FloorPlanObject } from '@/types';
import { 
  updateFloorPlan, 
  deleteFloorPlan, 
  addObjectToFloorPlan, 
  updateFloorPlanObject, 
  removeObjectFromFloorPlan
} from '@/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useFloorPlanActions(floorPlan: FloorPlan | null, setFloorPlan: (plan: FloorPlan | null) => void, selectedObjectId: string | null, setSelectedObjectId: (id: string | null) => void) {
  const router = useRouter();
  
  const handleSave = () => {
    if (!floorPlan) return;
    
    updateFloorPlan(floorPlan.id, {
      name: floorPlan.name,
      width: floorPlan.width,
      height: floorPlan.height,
      roomId: floorPlan.roomId,
      objects: floorPlan.objects
    });
    
    toast.success('Floor plan saved successfully');
  };

  const handleDelete = () => {
    if (!floorPlan) return;
    
    if (window.confirm('Are you sure you want to delete this floor plan?')) {
      const success = deleteFloorPlan(floorPlan.id);
      if (success) {
        router.push('/floor-plans');
      }
    }
  };

  const handleAddDesk = (type: string) => {
    if (!floorPlan) return;
    
    const newObject: Omit<FloorPlanObject, 'id'> = {
      type: 'desk',
      x: floorPlan.width / 2 - 30,
      y: floorPlan.height / 2 - 20,
      width: 60,
      height: 40,
      rotation: 0,
      properties: { type }
    };
    
    const addedObject = addObjectToFloorPlan(floorPlan.id, newObject);
    if (addedObject) {
      setFloorPlan({
        ...floorPlan,
        objects: [...floorPlan.objects, addedObject]
      });
      
      setSelectedObjectId(addedObject.id);
    }
  };

  const handleAddWall = () => {
    if (!floorPlan) return;
    
    const newObject: Omit<FloorPlanObject, 'id'> = {
      type: 'wall',
      x: floorPlan.width / 2 - 100,
      y: floorPlan.height / 2 - 5,
      width: 200,
      height: 10,
      rotation: 0
    };
    
    const addedObject = addObjectToFloorPlan(floorPlan.id, newObject);
    if (addedObject) {
      setFloorPlan({
        ...floorPlan,
        objects: [...floorPlan.objects, addedObject]
      });
      
      setSelectedObjectId(addedObject.id);
    }
  };

  const handleAddDoor = () => {
    if (!floorPlan) return;
    
    const newObject: Omit<FloorPlanObject, 'id'> = {
      type: 'door',
      x: floorPlan.width / 2 - 30,
      y: floorPlan.height / 2 - 5,
      width: 60,
      height: 10,
      rotation: 0
    };
    
    const addedObject = addObjectToFloorPlan(floorPlan.id, newObject);
    if (addedObject) {
      setFloorPlan({
        ...floorPlan,
        objects: [...floorPlan.objects, addedObject]
      });
      
      setSelectedObjectId(addedObject.id);
    }
  };

  const handleUpdateObject = (objectId: string, updates: Partial<Omit<FloorPlanObject, 'id'>>) => {
    if (!floorPlan) return;
    
    if ('type' in updates && updates.type === undefined) {
      handleDeleteObject(objectId);
      return;
    }
    
    const updatedObject = updateFloorPlanObject(floorPlan.id, objectId, updates);
    if (updatedObject) {
      setFloorPlan({
        ...floorPlan,
        objects: floorPlan.objects.map(obj => 
          obj.id === objectId ? updatedObject : obj
        )
      });
    }
  };

  const handleDeleteObject = (objectId: string) => {
    if (!floorPlan) return;
    
    const success = removeObjectFromFloorPlan(floorPlan.id, objectId);
    if (success) {
      setFloorPlan({
        ...floorPlan,
        objects: floorPlan.objects.filter(obj => obj.id !== objectId)
      });
      
      if (selectedObjectId === objectId) {
        setSelectedObjectId(null);
      }
    }
  };

  const handleUpdateFloorPlan = (updates: Partial<FloorPlan>) => {
    if (!floorPlan) return;
    
    setFloorPlan({
      ...floorPlan,
      ...updates
    });
  };

  return {
    handleSave,
    handleDelete,
    handleAddDesk,
    handleAddWall,
    handleAddDoor,
    handleUpdateObject,
    handleDeleteObject,
    handleUpdateFloorPlan
  };
}
