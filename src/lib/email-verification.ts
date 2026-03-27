import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db';

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_FROM_EMAIL = 'Deskaroo <onboarding@resend.dev>';

const hashVerificationToken = (token: string) => createHash('sha256').update(token).digest('hex');

const getEmailVerificationBaseUrl = (request?: Request) => {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return 'http://localhost:3000';
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const buildVerificationEmailHtml = (name: string, verificationUrl: string) => {
  const safeName = escapeHtml(name);
  const safeVerificationUrl = escapeHtml(verificationUrl);

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>Hello ${safeName},</p>
      <p>Thanks for creating your Deskaroo account. Confirm your email address to finish setting up access.</p>
      <p>
        <a
          href="${safeVerificationUrl}"
          style="display: inline-block; padding: 12px 20px; border-radius: 999px; background: #f5b308; color: #111827; text-decoration: none; font-weight: 600;"
        >
          Verify email
        </a>
      </p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p><a href="${safeVerificationUrl}">${safeVerificationUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    </div>
  `;
};

const sendVerificationEmail = async ({
  email,
  name,
  verificationUrl,
}: {
  email: string;
  name: string;
  verificationUrl: string;
}) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM_EMAIL,
      to: [email],
      subject: 'Verify your Deskaroo email',
      html: buildVerificationEmailHtml(name, verificationUrl),
      text: `Hello ${name}, verify your Deskaroo email by opening this link: ${verificationUrl}`,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unable to send verification email');
  }
};

export const issueEmailVerificationForUser = async ({
  userId,
  email,
  name,
  request,
}: {
  userId: string;
  email: string;
  name: string;
  request?: Request;
}) => {
  const rawToken = randomBytes(48).toString('base64url');
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);

  await prisma.$transaction(async (tx) => {
    await tx.emailVerificationToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await tx.emailVerificationToken.create({
      data: {
        userId,
        tokenHash: hashVerificationToken(rawToken),
        expiresAt,
      },
    });
  });

  const verificationUrl = new URL('/api/auth/email-verification/verify', getEmailVerificationBaseUrl(request));
  verificationUrl.searchParams.set('token', rawToken);

  await sendVerificationEmail({
    email,
    name,
    verificationUrl: verificationUrl.toString(),
  });

  return {
    expiresAt,
  };
};

type VerificationResult =
  | { status: 'verified'; email: string }
  | { status: 'already_verified'; email: string }
  | { status: 'expired'; email: string }
  | { status: 'invalid' };

export const consumeEmailVerificationToken = async (token: string): Promise<VerificationResult> => {
  const tokenHash = hashVerificationToken(token);

  const existingToken = await prisma.emailVerificationToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
          emailVerificationRequired: true,
        },
      },
    },
  });

  if (!existingToken) {
    return { status: 'invalid' };
  }

  if (existingToken.user.emailVerifiedAt || !existingToken.user.emailVerificationRequired) {
    return {
      status: 'already_verified',
      email: existingToken.user.email,
    };
  }

  if (existingToken.usedAt || existingToken.expiresAt <= new Date()) {
    return {
      status: 'expired',
      email: existingToken.user.email,
    };
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: existingToken.user.id,
      },
      data: {
        emailVerifiedAt: now,
        emailVerificationRequired: false,
      },
    });

    await tx.emailVerificationToken.update({
      where: {
        id: existingToken.id,
      },
      data: {
        usedAt: now,
      },
    });

    await tx.emailVerificationToken.updateMany({
      where: {
        userId: existingToken.user.id,
        usedAt: null,
      },
      data: {
        usedAt: now,
      },
    });
  });

  return {
    status: 'verified',
    email: existingToken.user.email,
  };
};
