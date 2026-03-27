
// Re-export everything from the module files
export { initializeFloorPlans, floorPlans } from './mockData';
export { getAllFloorPlans, getFloorPlanById, getFloorPlansByRoomId } from './getFloorPlans';
export { createFloorPlan, updateFloorPlan, deleteFloorPlan } from './modifyFloorPlans';
export {
  addObjectToFloorPlan,
  updateFloorPlanObject,
  removeObjectFromFloorPlan
} from './floorPlanObjects';

// Import all functions for the default export
import { initializeFloorPlans } from './mockData';
import { getAllFloorPlans, getFloorPlanById, getFloorPlansByRoomId } from './getFloorPlans';
import { createFloorPlan, updateFloorPlan, deleteFloorPlan } from './modifyFloorPlans';
import { addObjectToFloorPlan, updateFloorPlanObject, removeObjectFromFloorPlan } from './floorPlanObjects';

// Export a default object with all methods for backward compatibility
export default {
  getAllFloorPlans,
  getFloorPlanById,
  getFloorPlansByRoomId,
  createFloorPlan,
  updateFloorPlan,
  deleteFloorPlan,
  addObjectToFloorPlan,
  updateFloorPlanObject,
  removeObjectFromFloorPlan,
  initializeFloorPlans
};

// Run initialization
initializeFloorPlans();
