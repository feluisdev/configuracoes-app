'use server';

import { getServerSession as getNextAuthServerSession } from "next-auth/next"
import { authOptions } from '@/features/auth/lib/auth';

export async function serverSession() {
  try {
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn("Warning: NEXTAUTH_SECRET is not set. This is required for production.")
      if (process.env.NODE_ENV === "production") {
        throw new Error("NEXTAUTH_SECRET must be set in production")
      }
    }

    if (!process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET || !process.env.KEYCLOAK_ISSUER) {
      console.warn("Warning: One or more Keycloak environment variables are missing.")
      return null
    }

    const session = await getNextAuthServerSession(authOptions)
    return session
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}