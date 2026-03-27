
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash } from 'lucide-react';
import { FloorPlan, Room } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface FloorPlanListProps {
  floorPlans: FloorPlan[];
  rooms: Room[];
  onCreateFloorPlan: (roomId: string, name: string) => FloorPlan;
  onDeleteFloorPlan: (floorPlanId: string) => void;
}

const FloorPlanList = ({
  floorPlans,
  rooms,
  onCreateFloorPlan,
  onDeleteFloorPlan
}: FloorPlanListProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newFloorPlanName, setNewFloorPlanName] = React.useState('');
  const [selectedRoomId, setSelectedRoomId] = React.useState('');
  const router = useRouter();

  const handleCreateFloorPlan = () => {
    if (!newFloorPlanName.trim()) {
      toast.error('Please enter a floor plan name');
      return;
    }

    if (!selectedRoomId) {
      toast.error('Please select a room');
      return;
    }

    const newFloorPlan = onCreateFloorPlan(selectedRoomId, newFloorPlanName);
    setIsCreateDialogOpen(false);
    setNewFloorPlanName('');
    setSelectedRoomId('');
    
    // Navigate to the editor for the new floor plan
    router.push(`/floor-plans/edit/${newFloorPlan.id}`);
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? `${room.name} (Floor ${room.floor})` : 'Unknown Room';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Floor Plans</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Floor Plan
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Floor Plan</DialogTitle>
              <DialogDescription>
                Create a new floor plan for a specific room.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="floor-plan-name">Floor Plan Name</Label>
                <Input 
                  id="floor-plan-name" 
                  placeholder="Enter floor plan name"
                  value={newFloorPlanName}
                  onChange={(e) => setNewFloorPlanName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room-select">Select Room</Label>
                <select 
                  id="room-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                >
                  <option value="">Select a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Floor {room.floor})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFloorPlan}>
                Create Floor Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {floorPlans.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-3">
              <p className="text-gray-500">No floor plans available</p>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Create your first floor plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {floorPlans.map(floorPlan => (
            <Card key={floorPlan.id}>
              <CardHeader className="pb-2">
                <CardTitle>{floorPlan.name}</CardTitle>
                <CardDescription>
                  {getRoomName(floorPlan.roomId)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div 
                  className="bg-gray-100 rounded-md w-full h-40 flex items-center justify-center overflow-hidden"
                >
                  {/* Simplified floor plan preview */}
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 border-2 border-dashed border-gray-300 m-2 rounded-md">
                      {floorPlan.objects.map(obj => (
                        <div
                          key={obj.id}
                          className="absolute"
                          style={{
                            left: `${(obj.x / floorPlan.width) * 100}%`,
                            top: `${(obj.y / floorPlan.height) * 100}%`,
                            width: `${(obj.width / floorPlan.width) * 100}%`,
                            height: `${(obj.height / floorPlan.height) * 100}%`,
                            backgroundColor: obj.type === 'desk' 
                              ? 'rgba(74, 222, 128, 0.5)' 
                              : obj.type === 'wall' 
                                ? 'rgba(75, 85, 99, 0.7)' 
                                : 'rgba(251, 191, 36, 0.5)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-0">
                <div className="text-sm text-gray-500">
                  {floorPlan.objects.filter(obj => obj.type === 'desk').length} desks
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteFloorPlan(floorPlan.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/floor-plans/edit/${floorPlan.id}`)}
                  >
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloorPlanList;
