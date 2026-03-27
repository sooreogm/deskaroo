
import { useState } from 'react';
import { Desk, Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import DeskUtilitiesList from '@/components/icons/DeskUtilities';
import { ArrowUpDown } from 'lucide-react';

interface DeskCardProps {
  desk: Desk;
  room: Room;
  isSelected: boolean;
  isBooked: boolean;
  onClick: () => void;
}

const DeskCard = ({ desk, room, isSelected, isBooked, onClick }: DeskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColor = {
    available: 'bg-green-100 text-green-800 border-green-300',
    booked: 'bg-red-100 text-red-800 border-red-300',
    maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const statusText = {
    available: 'Available',
    booked: 'Booked',
    maintenance: 'Maintenance',
  };

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-300 ease-in-out hover-scale",
        isSelected ? "ring-2 ring-primary shadow-lg" : "",
        isBooked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
      onClick={isBooked ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className={cn(
        "pb-2",
        isSelected ? "bg-primary/10" : ""
      )}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{desk.name}</CardTitle>
          <Badge className={statusColor[desk.status]}>{statusText[desk.status]}</Badge>
        </div>
        <CardDescription>
          {room.name}, Floor {room.floor}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-20 flex items-center justify-center">
          <div className={cn(
            "desk w-16 h-12 flex items-center justify-center transition-all duration-300",
            desk.status === 'available' ? "desk-available" : "",
            desk.status === 'booked' ? "desk-booked" : "",
            isSelected ? "desk-selected" : ""
          )}>
            <span className="text-xs font-medium">{desk.name}</span>
          </div>
        </div>
        
        {/* Desk Type Badge */}
        {desk.type && (
          <div className="mt-2 mb-3 flex justify-center">
            <Badge variant="outline" className="flex items-center gap-1">
              {desk.type === 'standing' && <ArrowUpDown className="h-3 w-3" />}
              {desk.type.charAt(0).toUpperCase() + desk.type.slice(1)} Desk
            </Badge>
          </div>
        )}
        
        {/* Desk Utilities */}
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-1">Utilities:</h4>
          {desk.utilities ? (
            <DeskUtilitiesList utilities={desk.utilities} className="justify-center" />
          ) : (
            <p className="text-sm text-gray-500 text-center">No utilities available</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className="w-full"
          disabled={isBooked || desk.status !== 'available'}
          onClick={onClick}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeskCard;
