
import { FloorPlanObject } from '@/types';
import { floorPlans } from './mockData';
import { getFloorPlanById } from './getFloorPlans';
import { toast } from 'sonner';

// Add an object to a floor plan
export const addObjectToFloorPlan = (
  floorPlanId: string,
  object: Omit<FloorPlanObject, 'id'>
): FloorPlanObject | undefined => {
  const floorPlan = getFloorPlanById(floorPlanId);
  
  if (!floorPlan) {
    toast.error('Floor plan not found');
    return undefined;
  }
  
  const newObject: FloorPlanObject = {
    id: `object-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...object
  };
  
  floorPlan.objects.push(newObject);
  floorPlan.updatedAt = new Date();
  
  return newObject;
};

// Update an object in a floor plan
export const updateFloorPlanObject = (
  floorPlanId: string,
  objectId: string,
  updates: Partial<Omit<FloorPlanObject, 'id'>>
): FloorPlanObject | undefined => {
  const floorPlan = getFloorPlanById(floorPlanId);
  
  if (!floorPlan) {
    toast.error('Floor plan not found');
    return undefined;
  }
  
  const objectIndex = floorPlan.objects.findIndex(obj => obj.id === objectId);
  
  if (objectIndex === -1) {
    toast.error('Floor plan object not found');
    return undefined;
  }
  
  floorPlan.objects[objectIndex] = {
    ...floorPlan.objects[objectIndex],
    ...updates
  };
  
  floorPlan.updatedAt = new Date();
  return floorPlan.objects[objectIndex];
};

// Remove an object from a floor plan
export const removeObjectFromFloorPlan = (
  floorPlanId: string,
  objectId: string
): boolean => {
  const floorPlan = getFloorPlanById(floorPlanId);
  
  if (!floorPlan) {
    toast.error('Floor plan not found');
    return false;
  }
  
  const initialLength = floorPlan.objects.length;
  floorPlan.objects = floorPlan.objects.filter(obj => obj.id !== objectId);
  
  if (floorPlan.objects.length === initialLength) {
    toast.error('Floor plan object not found');
    return false;
  }
  
  floorPlan.updatedAt = new Date();
  return true;
};
