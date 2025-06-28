'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/features/auth/lib/auth-options'

export async function serverSession() {
  const session = await getServerSession(authOptions) 
  return session
}