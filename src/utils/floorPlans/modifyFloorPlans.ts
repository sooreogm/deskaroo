
import { FloorPlan } from '@/types';
import { floorPlans } from './mockData';
import { getCurrentUser } from '../users';
import { toast } from 'sonner';

// Create a new floor plan
export const createFloorPlan = (
  roomId: string,
  name: string,
  width: number = 800,
  height: number = 600
): FloorPlan => {
  const currentUser = getCurrentUser();
  
  const newFloorPlan: FloorPlan = {
    id: `floor-plan-${Date.now()}`,
    roomId,
    name,
    width,
    height,
    objects: [],
    createdBy: currentUser.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  floorPlans.push(newFloorPlan);
  toast.success('Floor plan created successfully');
  
  return newFloorPlan;
};

// Update a floor plan
export const updateFloorPlan = (
  id: string,
  updates: Partial<Omit<FloorPlan, 'id' | 'createdBy' | 'createdAt'>>
): FloorPlan | undefined => {
  const index = floorPlans.findIndex(plan => plan.id === id);
  
  if (index === -1) {
    toast.error('Floor plan not found');
    return undefined;
  }
  
  floorPlans[index] = {
    ...floorPlans[index],
    ...updates,
    updatedAt: new Date()
  };
  
  toast.success('Floor plan updated successfully');
  return floorPlans[index];
};

// Delete a floor plan
export const deleteFloorPlan = (id: string): boolean => {
  const initialLength = floorPlans.length;
  const newFloorPlans = floorPlans.filter(plan => plan.id !== id);
  
  if (newFloorPlans.length === initialLength) {
    toast.error('Floor plan not found');
    return false;
  }
  
  // Instead of reassigning the imported array, modify its contents
  floorPlans.length = 0;
  floorPlans.push(...newFloorPlans);
  
  toast.success('Floor plan deleted successfully');
  return true;
};
