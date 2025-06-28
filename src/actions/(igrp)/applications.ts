'use server';

import { Application } from '@/features/applications/types';
import { callApi } from '@/lib/api-client';

export async function getApplications() {
  return callApi<Application[]>("/api/applications")
}

export async function getApplicationByCode(code: string) {
  return callApi<Application[]>(`/api/applications?code=${code}`, {
    method: 'GET',
  });
}
