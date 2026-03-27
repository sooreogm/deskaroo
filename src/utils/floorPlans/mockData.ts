
import { FloorPlan, FloorPlanObject } from '@/types';

// Mock floor plans data
let floorPlans: FloorPlan[] = [];

// Initialize with some sample floor plans
export const initializeFloorPlans = () => {
  floorPlans = [
    {
      id: 'floor-plan-1',
      roomId: 'room-1',
      name: 'Main Office Layout',
      width: 800,
      height: 600,
      objects: [
        {
          id: 'object-1',
          type: 'desk',
          x: 100,
          y: 100,
          width: 60,
          height: 40,
          rotation: 0,
          properties: { deskId: 'desk-1', type: 'standard' }
        },
        {
          id: 'object-2',
          type: 'desk',
          x: 200,
          y: 100,
          width: 60,
          height: 40,
          rotation: 0,
          properties: { deskId: 'desk-2', type: 'standard' }
        },
        {
          id: 'object-3',
          type: 'wall',
          x: 0,
          y: 0,
          width: 800,
          height: 10,
          rotation: 0
        },
        {
          id: 'object-4',
          type: 'door',
          x: 400,
          y: 0,
          width: 60,
          height: 10,
          rotation: 0
        }
      ],
      createdBy: 'admin-1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
};

// Export the floorPlans array for use in other modules
export { floorPlans };
