'use server';

import { callApi } from '@/lib/api-client';
import { UserProps } from '@/features/users/types';

export async function getUser() {
  return callApi<UserProps>('/api/users/currentUser');
}
