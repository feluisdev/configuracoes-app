import type { NextAuthOptions, TokenSet } from "next-auth"
import type { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

export async function requestRefreshOfAccessToken(token: JWT) {
  if (!process.env.KEYCLOAK_ISSUER || !process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET) {
    console.error("Keycloak environment variables are not set for token refresh.")
    throw new Error("Missing Keycloak configuration for token refresh.")
  }

  if (!token.refreshToken) {
    console.error("No refresh token available.")
    throw new Error("Missing refresh token.")
  }

  return await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken! as string,
    }),
    method: 'POST',
  });
}

export async function doFinalSignoutHandshake(jwt: JWT) {
  const { idToken } = jwt;

  if (idToken && process.env.KEYCLOAK_ISSUER) {
    try {
      const params = new URLSearchParams();
      params.append('id_token_hint', idToken as string);

      const response = await fetch(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params.toString()}`,
        { method: 'GET' },
      );

      console.log('Completed post-logout handshake', response.status, response.statusText);
    } catch (e) {
      console.error('Unable to perform post-logout handshake', e instanceof Error ? e.message : String(e));
    }
  } else {
    if (!idToken) console.warn("No idToken found for Keycloak post-logout handshake.")
    if (!process.env.KEYCLOAK_ISSUER) console.warn("KEYCLOAK_ISSUER not set for post-logout handshake.")
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: any; }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        delete token.error
        return token;
      }

      if (token.expiresAt && Date.now() < token.expiresAt * 1000 - 60 * 1000) {
        return token;
      }

      try {
        if (!token.refreshToken) {
          console.error("No refresh token available for refresh.")
          return { ...token, error: "RefreshAccessTokenError" as const }
        }

        const response = await requestRefreshOfAccessToken(token);
        const tokens: TokenSet = await response.json();

        if (!response.ok) {
          console.error("Error refreshing access token, response not ok:", tokens)
          throw tokens
        }

        const updatedToken: JWT = {
          ...token,
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + Number(tokens.expires_in)),
          refreshToken: tokens.refresh_token ?? token.refreshToken,
          error: undefined,
        };
        return updatedToken;
      } catch (error) {
        console.error('Error refreshing access token', error);
        return { ...token, error: "RefreshAccessTokenError" as const }
      }
    },
    async session({ session, token }) {
      session.user = token.user as any
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      session.idToken = token.idToken as string
      session.expiresAt = token.expiresAt;

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token) {
        // Ensure token exists
        await doFinalSignoutHandshake(token as JWT)
      }
    },
  },
};