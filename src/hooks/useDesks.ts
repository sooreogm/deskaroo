import { useQuery } from '@tanstack/react-query';
import { fetchDesks, fetchRooms } from '@/lib/api';

export const useDesks = (roomId?: string) => {
  return useQuery({
    queryKey: ['desks', roomId],
    queryFn: async () => fetchDesks(roomId),
  });
};

export const useDesk = (deskId: string | null) => {
  return useQuery({
    queryKey: ['desks', 'single', deskId],
    queryFn: async () => {
      if (!deskId) return null;
      const [desks, rooms] = await Promise.all([fetchDesks(), fetchRooms()]);
      const desk = desks.find((item) => item.id === deskId);
      if (!desk) return null;

      const room = rooms.find((item) => item.id === desk.roomId);
      return {
        ...desk,
        room: room ? { name: room.name } : undefined,
      };
    },
    enabled: !!deskId,
  });
};
