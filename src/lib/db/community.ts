import { prisma } from '@/lib/db';

const DEFAULT_COMMUNITY_SPACE = {
  slug: 'community-hub',
  name: 'Community Space',
  description: 'A shared space for office updates, quick questions, and everyday team conversation.',
};

export const ensureDefaultCommunitySpace = () => {
  return prisma.communitySpace.upsert({
    where: {
      slug: DEFAULT_COMMUNITY_SPACE.slug,
    },
    update: {
      name: DEFAULT_COMMUNITY_SPACE.name,
      description: DEFAULT_COMMUNITY_SPACE.description,
    },
    create: DEFAULT_COMMUNITY_SPACE,
  });
};

export const toCommunitySpaceSummary = (space: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  _count: {
    memberships: number;
    messages: number;
  };
}) => {
  return {
    id: space.id,
    slug: space.slug,
    name: space.name,
    description: space.description ?? undefined,
    memberCount: space._count.memberships,
    messageCount: space._count.messages,
  };
};

export const toCommunityMembershipResponse = (membership: {
  id: string;
  spaceId: string;
  userId: string;
  joinedAt: Date;
  lastReadAt: Date | null;
} | null) => {
  if (!membership) {
    return null;
  }

  return {
    id: membership.id,
    spaceId: membership.spaceId,
    userId: membership.userId,
    joinedAt: membership.joinedAt.toISOString(),
    lastReadAt: membership.lastReadAt?.toISOString() ?? null,
  };
};

export const toCommunityMessageResponse = (
  message: {
    id: string;
    spaceId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    attachments?: Array<{
      id: string;
      kind: string;
      fileName: string;
      mimeType: string;
      size: number;
    }>;
    sender: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
      department: string | null;
    };
  },
  currentUserId: string
) => {
  return {
    id: message.id,
    spaceId: message.spaceId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    isCurrentUser: message.sender.id === currentUserId,
    attachments: (message.attachments ?? []).map((attachment) => ({
      id: attachment.id,
      kind: attachment.kind,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: `/api/community/messages/${message.id}/attachments/${attachment.id}`,
    })),
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      email: message.sender.email,
      avatarUrl: message.sender.avatarUrl,
      department: message.sender.department ?? undefined,
    },
  };
};
