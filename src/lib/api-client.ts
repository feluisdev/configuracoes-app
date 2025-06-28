'use server';

import { serverSession } from '@/actions/(igrp)/auth';
import { redirect } from 'next/navigation';

interface ExtendedRequestInit extends RequestInit {
  isTextResponse?: boolean;
}

export async function callApi<T>(endpoint: string, options: ExtendedRequestInit = {}): Promise<T> {
  if (process.env.NODE_ENV !== 'production') return null as T;

  if (!process.env.APP_MANAGER_API) {
    throw new Error('APP_MANAGER_API is not defined');
  }

  const API_URL = process.env.APP_MANAGER_API;
  const session = await serverSession();

  if (!session?.accessToken) {
    redirect('/login');
  }

  const url = `${API_URL}${endpoint}`;

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.accessToken}`,
    ...((options.headers as Record<string, string>) || {}),
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete baseHeaders['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers: baseHeaders,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error (${response.status})`);
  }

  if (options.isTextResponse) {
    return (await response.text()) as unknown as T;
  }

  // Handle 204 No Content (delete operations) or empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return (await response.json()) as T;
}
