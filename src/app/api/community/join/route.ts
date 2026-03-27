import { NextResponse } from 'next/server';
import { getAuthenticatedRequestUser } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { ensureDefaultCommunitySpace, toCommunityMembershipResponse } from '@/lib/db/community';
import { ensureSeedData } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureSeedData();

    const user = await getAuthenticatedRequestUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!user.avatarUrl) {
      return NextResponse.json(
        { error: 'Upload a profile picture to join the community space.' },
        { status: 403 }
      );
    }

    const space = await ensureDefaultCommunitySpace();
    const now = new Date();
    const membership = await prisma.communityMembership.upsert({
      where: {
        spaceId_userId: {
          spaceId: space.id,
          userId: user.id,
        },
      },
      update: {
        lastReadAt: now,
      },
      create: {
        spaceId: space.id,
        userId: user.id,
        lastReadAt: now,
      },
    });

    return NextResponse.json({
      membership: toCommunityMembershipResponse(membership),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to join the community space' },
      { status: 500 }
    );
  }
}
