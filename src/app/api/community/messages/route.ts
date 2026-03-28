import { NextResponse } from 'next/server';
import { getAuthenticatedRequestUser } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { ensureDefaultCommunitySpace, toCommunityMessageResponse } from '@/lib/db/community';
import { ensureSeedData } from '@/lib/db/seed';

const MAX_MESSAGE_LENGTH = 600;
const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

const readMessagePayload = async (request: Request) => {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const attachment = formData.get('attachment');

    return {
      content: String(formData.get('content') ?? ''),
      attachment: attachment instanceof File && attachment.size > 0 ? attachment : null,
    };
  }

  const payload = await request.json();

  return {
    content: String(payload.content ?? ''),
    attachment: null,
  };
};

const validateAttachment = (file: File) => {
  if (file.size <= 0) {
    throw new Error('Uploaded files cannot be empty.');
  }

  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    throw new Error('Attachments must be 10MB or smaller.');
  }
};

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

    const { content, attachment } = await readMessagePayload(request);
    const trimmedContent = String(content ?? '').trim();

    if (!trimmedContent && !attachment) {
      return NextResponse.json(
        { error: 'Add a message or an attachment before sending.' },
        { status: 400 }
      );
    }

    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    if (attachment) {
      validateAttachment(attachment);
    }

    const space = await ensureDefaultCommunitySpace();
    const membership = await prisma.communityMembership.findUnique({
      where: {
        spaceId_userId: {
          spaceId: space.id,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Join the community space before sending messages.' },
        { status: 403 }
      );
    }

    const attachments = await Promise.all(
      [attachment]
        .filter((file): file is File => !!file)
        .map(async (file) => ({
          kind: 'file',
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          data: Buffer.from(await file.arrayBuffer()),
        }))
    );

    const message = await prisma.$transaction(async (tx) => {
      const createdMessage = await tx.communityMessage.create({
        data: {
          spaceId: space.id,
          senderId: user.id,
          content: trimmedContent,
          attachments: attachments.length
            ? {
                create: attachments,
              }
            : undefined,
        },
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
      });

      await tx.communityMembership.update({
        where: {
          id: membership.id,
        },
        data: {
          lastReadAt: new Date(),
        },
      });

      return createdMessage;
    });

    return NextResponse.json(toCommunityMessageResponse(message, user.id), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to send message' },
      { status: 500 }
    );
  }
}
