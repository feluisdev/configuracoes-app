'use server'

import { redirect } from 'next/navigation'
import { serverSession } from './auth'
import { IGRPMenuProps } from '@/features/menus/types'

async function callApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  if (process.env.NODE_ENV !== "production") return null as T

  const API_URL = process.env.NEXT_PUBLIC_APP_MANAGER_API ?? ''
  const session = await serverSession()

  if (!session?.accessToken) {
    redirect('/login')
  }
  
  const url = `${API_URL}${endpoint}`

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.accessToken}`,
    // 'Authorization': `Bearer ${token}`,
    ...(options.headers as Record<string, string> || {})
  }
  
  if (options.body instanceof FormData) {
    delete baseHeaders['Content-Type']
  }
  
  const response = await fetch(url, {
    ...options,
    headers: baseHeaders
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API Error (${response.status})`)
  }
  
  if (response.headers.get('content-length') === '0') {
    return {} as T
  }
  
  return await response.json() as T
}

interface MenuQueryParams {
  applicationId?: number;
  name?: string;
  type?: string;
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const validParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
  
  return validParams.length > 0 ? `?${validParams.join('&')}` : ''
}


export async function getMenus(params?: MenuQueryParams) {
  const queryString = params ? buildQueryString(params as Record<string, string | number | undefined>) : ''
  
  return callApi<IGRPMenuProps[]>(`/api/menus${queryString}`, {
    method: 'GET'
  })
}

export async function getMenusByApplication(applicationId: number) {
  if (!applicationId) {
    throw new Error('Application ID is required')
  }
  
  return getMenus({ applicationId })
}