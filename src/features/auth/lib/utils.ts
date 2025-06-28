import { JWT } from 'next-auth/jwt';

export async function doFinalSignoutHandshake(jwt: JWT) {
  const { idToken } = jwt;

  if (idToken) {
    try {
      const params = new URLSearchParams();
      params.append('id_token_hint', idToken as string);

      const response = await fetch(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params.toString()}`,
        { method: 'GET' },
      );

      console.log('Completed post-logout handshake', response.status, response.statusText);
    } catch (e) {
      console.error('Unable to perform post-logout handshake', e instanceof Error ? e.message : e);
    }
  }
}

export async function requestRefreshOfAccessToken(token: JWT) {
  return await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken! as string,
    }),
    method: 'POST',
  });
}
