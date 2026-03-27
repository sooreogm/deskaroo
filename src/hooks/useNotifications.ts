import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getUserNotifications, markNotificationAsRead } from '@/utils';

export const useNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return getUserNotifications(user.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 20);
    },
    enabled: !!user,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
