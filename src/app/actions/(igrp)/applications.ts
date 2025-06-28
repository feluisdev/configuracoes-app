'use server'

import { redirect } from 'next/navigation'
import { serverSession } from './auth'
import { Application } from '@/features/applications/types'

interface ExtendedRequestInit extends RequestInit {
  isTextResponse?: boolean;
}

async function callApi<T>(
  endpoint: string, 
  options: ExtendedRequestInit = {}
): Promise<T> {
  if (process.env.NODE_ENV !== "production") return {} as T
  
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
  
  // Para casos em que a resposta é vazia
  if (response.headers.get('content-length') === '0') {
    return {} as T
  }
  
  // Para requests que retornam texto em vez de JSON
  if (options.isTextResponse) {
    return await response.text() as unknown as T
  }
  
  return await response.json() as T
}

export async function getApplicationByCode(code: string) {
  return callApi<Application[]>(`/api/applications?code=${code}`, {
    method: "GET",
  })
}