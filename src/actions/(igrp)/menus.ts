'use server';

import { IGRPMenuProps } from '@/features/menus/types';
import { callApi } from '@/lib/api-client';
import { buildQueryString } from '@/lib/utils';

interface MenuQueryParams {
  applicationId?: number;
  name?: string;
  type?: string;
}

export async function getMenus(params?: MenuQueryParams) {
  const queryString = params
    ? buildQueryString(params as Record<string, string | number | undefined>)
    : '';

  return callApi<IGRPMenuProps[]>(`/api/menus${queryString}`, {
    method: 'GET',
  });
}

export async function getMenusByApplication(applicationId: number) {
  if (!applicationId) {
    throw new Error('Application ID is required');
  }

  return getMenus({ applicationId });
}
