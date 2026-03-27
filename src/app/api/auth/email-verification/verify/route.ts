import { NextResponse } from 'next/server';
import { ensureSeedData } from '@/lib/db/seed';
import { consumeEmailVerificationToken } from '@/lib/email-verification';

const redirectToLogin = (request: Request, params: Record<string, string>) => {
  const loginUrl = new URL('/login', request.url);

  Object.entries(params).forEach(([key, value]) => {
    loginUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(loginUrl);
};

export async function GET(request: Request) {
  try {
    await ensureSeedData();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return redirectToLogin(request, { verification: 'invalid' });
    }

    const result = await consumeEmailVerificationToken(token);

    if (result.status === 'verified' || result.status === 'already_verified') {
      return redirectToLogin(request, { verified: '1', email: result.email });
    }

    if (result.status === 'expired') {
      return redirectToLogin(request, { verification: 'expired', email: result.email });
    }

    return redirectToLogin(request, { verification: 'invalid' });
  } catch {
    return redirectToLogin(request, { verification: 'invalid' });
  }
}
