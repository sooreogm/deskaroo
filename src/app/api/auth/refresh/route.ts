import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  clearRefreshTokenCookie,
  getRefreshTokenCookieName,
  rotateRefreshToken,
  setRefreshTokenCookie,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(getRefreshTokenCookieName())?.value;

  if (!refreshToken) {
    const response = NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
    clearRefreshTokenCookie(response);
    return response;
  }

  try {
    const rotatedSession = await rotateRefreshToken(refreshToken);

    if (!rotatedSession) {
      const response = NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
      clearRefreshTokenCookie(response);
      return response;
    }

    const response = NextResponse.json(rotatedSession.body, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    setRefreshTokenCookie(response, rotatedSession.refreshToken, rotatedSession.refreshExpiresAt);

    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to refresh session' },
      { status: 500 }
    );
    clearRefreshTokenCookie(response);
    return response;
  }
}
