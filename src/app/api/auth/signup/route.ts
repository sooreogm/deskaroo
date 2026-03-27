import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import { issueEmailVerificationForUser } from '@/lib/email-verification';
import { hashPassword } from '@/lib/password';
import { toUserResponse } from '@/lib/db/transformers';

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const { email, password, name } = await request.json();
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const normalizedName = String(name ?? '').trim();

    if (!normalizedName || !normalizedEmail || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        passwordHash: await hashPassword(String(password)),
        role: 'user',
        emailVerificationRequired: true,
      },
    });

    let verificationEmailSent = true;

    try {
      await issueEmailVerificationForUser({
        userId: user.id,
        email: user.email,
        name: user.name,
        request,
      });
    } catch {
      verificationEmailSent = false;
    }

    return NextResponse.json({
      user: toUserResponse(user),
      email: user.email,
      verificationRequired: true,
      verificationEmailSent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to sign up' },
      { status: 500 }
    );
  }
}
