
import { FloorPlan } from '@/types';
import { floorPlans } from './mockData';

// Get all floor plans
export const getAllFloorPlans = (): FloorPlan[] => {
  return [...floorPlans];
};

// Get floor plan by ID
export const getFloorPlanById = (id: string): FloorPlan | undefined => {
  return floorPlans.find(plan => plan.id === id);
};

// Get floor plans by room ID
export const getFloorPlansByRoomId = (roomId: string): FloorPlan[] => {
  return floorPlans.filter(plan => plan.roomId === roomId);
};
