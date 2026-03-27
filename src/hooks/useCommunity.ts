import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchCommunitySpace,
  joinCommunitySpaceRequest,
  postCommunityMessageRequest,
} from '@/lib/api';

export const useCommunitySpace = () => {
  return useQuery({
    queryKey: ['community', 'space'],
    queryFn: fetchCommunitySpace,
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  });
};

export const useJoinCommunitySpace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinCommunitySpaceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] });
      toast.success('You joined the community space.');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const usePostCommunityMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCommunityMessageRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
