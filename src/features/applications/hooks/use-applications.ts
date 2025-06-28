import { useQuery } from '@tanstack/react-query';
import { getApplicationByCode, getApplications } from '@/actions/(igrp)/applications';
import { Application } from '@/features/applications/types';

export const useApplications = () => {
  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: () => getApplications(),
  })  
}

export const useApplicationByCode = (code: string) => {
  return useQuery<Application[]>({
    queryKey: ['application', code],
    queryFn: () => getApplicationByCode(code),
  });
};
