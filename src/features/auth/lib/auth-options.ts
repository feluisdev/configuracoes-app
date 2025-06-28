import { NextAuthOptions, TokenSet } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { doFinalSignoutHandshake, requestRefreshOfAccessToken } from '@/features/auth/lib/utils';

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        return token;
      }

      if (token.expiresAt && Date.now() < token.expiresAt * 1000 - 60 * 1000) {
        return token;
      }

      try {
        const response = await requestRefreshOfAccessToken(token);
        const tokens: TokenSet = await response.json();

        if (!response.ok) throw tokens;

        const updatedToken: JWT = {
          ...token,
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + Number(tokens.expires_in)),
          refreshToken: tokens.refresh_token ?? token.refreshToken,
        };

        console.log('refreshToken::', updatedToken.refreshToken);
        return updatedToken;
      } catch (error) {
        console.error('Error refreshing access token', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      await doFinalSignoutHandshake(token);
    },
  },
};
