import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { clearRefreshTokenCookie, getRefreshTokenCookieName, revokeRefreshToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const refreshToken = cookies().get(getRefreshTokenCookieName())?.value;

  try {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    const response = NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    clearRefreshTokenCookie(response);
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to sign out' },
      { status: 500 }
    );
    clearRefreshTokenCookie(response);
    return response;
  }
}
