import { NextResponse } from 'next/server';
import { getAuthenticatedRequestUser } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import {
  ensureDefaultCommunitySpace,
  toCommunityMembershipResponse,
  toCommunityMessageResponse,
  toCommunitySpaceSummary,
} from '@/lib/db/community';
import { ensureSeedData } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await ensureSeedData();

    const user = await getAuthenticatedRequestUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const ensuredSpace = await ensureDefaultCommunitySpace();

    const [space, membership] = await Promise.all([
      prisma.communitySpace.findUniqueOrThrow({
        where: {
          id: ensuredSpace.id,
        },
        include: {
          _count: {
            select: {
              memberships: true,
              messages: true,
            },
          },
        },
      }),
      prisma.communityMembership.findUnique({
        where: {
          spaceId_userId: {
            spaceId: ensuredSpace.id,
            userId: user.id,
          },
        },
      }),
    ]);

    const requiresAvatar = !user.avatarUrl;
    const messages =
      membership && !requiresAvatar
        ? (
            await prisma.communityMessage.findMany({
              where: {
                spaceId: ensuredSpace.id,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 80,
              include: {
                attachments: {
                  orderBy: {
                    createdAt: 'asc',
                  },
                  select: {
                    id: true,
                    kind: true,
                    fileName: true,
                    mimeType: true,
                    size: true,
                  },
                },
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    department: true,
                  },
                },
              },
            })
          ).reverse()
        : [];

    return NextResponse.json({
      space: toCommunitySpaceSummary(space),
      membership: toCommunityMembershipResponse(membership),
      requiresAvatar,
      messages: messages.map((message) => toCommunityMessageResponse(message, user.id)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load community space' },
      { status: 500 }
    );
  }
}
