'use server'

import { fetchFromApi } from '@/lib/api-client'
import { serverSession } from './auth'
import { UserProps } from '@/features/users/types'


export async function getUser(): Promise<UserProps | null> {
  if (process.env.NODE_ENV === "development") return null

  const API_URL = process.env.NEXT_PUBLIC_USER_MANAGER_API  ?? '' 
  const session = await serverSession()

  const res = await fetchFromApi(API_URL, '/getUser', {
    token: session?.accessToken,
  })

  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  return res.json()
}

export async function getRolesFromUser(username?: string): Promise<string[]> {
  if (process.env.NODE_ENV === "development") return []

  const API_URL = process.env.NEXT_PUBLIC_USER_MANAGER_API  ?? ''  
  const session = await serverSession()

  const res = await fetchFromApi(API_URL, `/identity/getRolesFromUser?username=${username}`, {
    token: session?.accessToken,
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error('Failed to get roles')
  }

  return res.json()
}