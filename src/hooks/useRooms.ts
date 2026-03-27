import { useQuery } from '@tanstack/react-query';
import { fetchRooms } from '@/lib/api';

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });
};

export const useRoom = (roomId: string | null) => {
  return useQuery({
    queryKey: ['rooms', roomId],
    queryFn: async () => {
      if (!roomId) return null;
      const rooms = await fetchRooms();
      return rooms.find((room) => room.id === roomId) ?? null;
    },
    enabled: !!roomId,
  });
};
