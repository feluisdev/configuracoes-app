import { useQuery } from '@tanstack/react-query';
import { IGRPMenuProps } from '@/features/menus/types';
import { getMenus, getMenusByApplication } from '@/actions/(igrp)/menus';

interface MenuQueryParams {
  applicationId?: number;
  name?: string;
  type?: string;
}

export const useMenus = (params?: MenuQueryParams) => {
  return useQuery<IGRPMenuProps[]>({
    queryKey: ['menus', params],
    queryFn: () => getMenus(params),
  });
};

export const useMenusByApplication = (applicationId: number) => {
  return useQuery<IGRPMenuProps[]>({
    queryKey: ['menus', 'application', applicationId],
    queryFn: () => getMenusByApplication(applicationId),
    enabled: !!applicationId,
  });
};
