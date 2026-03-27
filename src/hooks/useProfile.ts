import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getUserProfile, updateUserProfile, uploadUserAvatar } from '@/utils/users';

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      return getUserProfile(user.id);
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { name?: string; phone?: string; department?: string; avatar_url?: string }) => {
      if (!user) throw new Error('Not authenticated');
      const data = await updateUserProfile(user.id, updates);
      if (!data) throw new Error('Profile not found');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUploadAvatar = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not authenticated');
      return uploadUserAvatar(user.id, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
