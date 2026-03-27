import { prisma } from '@/lib/db';
import { verifyAccessToken } from '@/lib/auth';

const readBearerToken = (request: Request) => {
  const authorization = request.headers.get('authorization') ?? '';
  const [scheme, token] = authorization.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

export const getAuthenticatedRequestUser = async (request: Request) => {
  const token = readBearerToken(request);

  if (!token) {
    return null;
  }

  const payload = verifyAccessToken(token);

  if (!payload?.sub) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: payload.sub,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      department: true,
      role: true,
    },
  });
};
