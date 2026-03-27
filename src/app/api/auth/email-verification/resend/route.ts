import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { issueEmailVerificationForUser } from '@/lib/email-verification';

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { email } = await request.json();
    const normalizedEmail = String(email ?? '').trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerifiedAt: true,
        emailVerificationRequired: true,
      },
    });

    if (user && user.emailVerificationRequired && !user.emailVerifiedAt) {
      await issueEmailVerificationForUser({
        userId: user.id,
        email: user.email,
        name: user.name,
        request,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'If that account still needs verification, we sent a fresh verification email.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to resend verification email' },
      { status: 500 }
    );
  }
}
