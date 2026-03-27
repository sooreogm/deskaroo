
import React from 'react';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import FloorPlanToolbar from './FloorPlanToolbar';
import FloorPlanCanvas from './FloorPlanCanvas';
import FloorPlanSidebar from './FloorPlanSidebar';
import FloorPlanLoading from './FloorPlanLoading';

const FloorPlanEditorLayout = () => {
  const {
    floorPlan,
    selectedObjectId,
    selectedObject,
    zoomLevel,
    rooms,
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
  } = useFloorPlan();

  if (!floorPlan) {
    return <FloorPlanLoading />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <FloorPlanToolbar 
        onSave={handleSave}
        onDelete={handleDelete}
        onAddDesk={handleAddDesk}
        onAddWall={handleAddWall}
        onAddDoor={handleAddDoor}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoomLevel={zoomLevel}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-hidden">
          <FloorPlanCanvas 
            floorPlan={floorPlan}
            selectedObjectId={selectedObjectId}
            zoomLevel={zoomLevel}
            onSelectObject={setSelectedObjectId}
            onUpdateObject={handleUpdateObject}
            onDeleteObject={handleDeleteObject}
            className="w-full h-full"
          />
        </div>
        
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          <FloorPlanSidebar 
            rooms={rooms}
            currentFloorPlan={floorPlan}
            selectedObject={selectedObject}
            onUpdateFloorPlan={handleUpdateFloorPlan}
            onUpdateObject={handleUpdateObject}
            onDeleteObject={handleDeleteObject}
            className="space-y-4"
          />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanEditorLayout;
