import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toUserResponse } from '@/lib/db/transformers';

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_COOKIE_NAME = 'deskaroo-refresh-token';

type SessionUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  phone: string | null;
  department: string | null;
  role: string;
  teamId: string | null;
};

type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
  type: 'access';
};

const encodeBase64Url = (value: string) => Buffer.from(value, 'utf8').toString('base64url');

const decodeBase64Url = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const getAccessTokenSecret = () => {
  const secret = process.env.AUTH_TOKEN_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'deskaroo-local-auth-secret';
  }

  throw new Error('AUTH_TOKEN_SECRET must be configured in production');
};

const signToken = (value: string) => createHmac('sha256', getAccessTokenSecret()).update(value).digest('base64url');

const hashRefreshToken = (token: string) => createHash('sha256').update(token).digest('hex');

const toAuthUser = (user: SessionUser) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  user_metadata: {
    name: user.name,
  },
});

const createAccessToken = (user: SessionUser) => {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + ACCESS_TOKEN_TTL_MS;
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: issuedAt,
      exp: expiresAt,
      type: 'access',
    } satisfies AccessTokenPayload)
  );
  const signature = signToken(`${header}.${payload}`);

  return {
    token: `${header}.${payload}.${signature}`,
    expiresAt: new Date(expiresAt),
  };
};

const buildAuthResponse = (user: SessionUser, refreshExpiresAt: Date) => {
  const accessToken = createAccessToken(user);

  return {
    user: toAuthUser(user),
    profile: toUserResponse(user),
    session: {
      access_token: accessToken.token,
      token_type: 'Bearer' as const,
      expires_at: accessToken.expiresAt.toISOString(),
      refresh_expires_at: refreshExpiresAt.toISOString(),
    },
  };
};

const createRefreshTokenValue = () => randomBytes(48).toString('base64url');

export const getRefreshTokenCookieName = () => REFRESH_TOKEN_COOKIE_NAME;

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  const [header, payload, signature] = token.split('.');

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = signToken(`${header}.${payload}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(decodeBase64Url(payload)) as AccessTokenPayload;
    if (parsedPayload.type !== 'access' || parsedPayload.exp <= Date.now()) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
};

export const issueSessionForUser = async (user: SessionUser) => {
  const refreshToken = createRefreshTokenValue();
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: refreshExpiresAt,
    },
  });

  return {
    body: buildAuthResponse(user, refreshExpiresAt),
    refreshToken,
    refreshExpiresAt,
  };
};

export const rotateRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashRefreshToken(refreshToken);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existingToken = await tx.refreshToken.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            phone: true,
            department: true,
            role: true,
            teamId: true,
          },
        },
      },
    });

    if (!existingToken || existingToken.revokedAt || existingToken.expiresAt <= now) {
      return null;
    }

    const nextRefreshToken = createRefreshTokenValue();
    const nextRefreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_TTL_MS);

    await tx.refreshToken.update({
      where: {
        id: existingToken.id,
      },
      data: {
        revokedAt: now,
      },
    });

    await tx.refreshToken.create({
      data: {
        userId: existingToken.userId,
        tokenHash: hashRefreshToken(nextRefreshToken),
        expiresAt: nextRefreshExpiresAt,
      },
    });

    return {
      user: existingToken.user,
      refreshToken: nextRefreshToken,
      refreshExpiresAt: nextRefreshExpiresAt,
      body: buildAuthResponse(existingToken.user, nextRefreshExpiresAt),
    };
  });
};

export const revokeRefreshToken = async (refreshToken: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashRefreshToken(refreshToken),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const revokeAllUserRefreshTokens = async (userId: string) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const setRefreshTokenCookie = (
  response: NextResponse,
  refreshToken: string,
  expiresAt: Date
) => {
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: refreshToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
};

export const clearRefreshTokenCookie = (response: NextResponse) => {
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  });
};
