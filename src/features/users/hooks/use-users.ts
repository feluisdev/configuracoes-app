import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/actions/(igrp)/user';
import type { UserProps } from '@/features/users/types';

export const useCurrentUser = () => {
  return useQuery<UserProps>({
    queryKey: ['current-user'],
    queryFn: async () => getUser(),
  });
};
