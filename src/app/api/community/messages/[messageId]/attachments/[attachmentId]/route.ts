import { NextResponse } from 'next/server';
import { getAuthenticatedRequestUser } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { ensureDefaultCommunitySpace } from '@/lib/db/community';

const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[\r\n"]/g, '_');
};

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ messageId: string; attachmentId: string }> }
) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { messageId, attachmentId } = await context.params;
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
        { error: 'Join the community space before accessing message attachments.' },
        { status: 403 }
      );
    }

    const attachment = await prisma.communityMessageAttachment.findUnique({
      where: {
        id: attachmentId,
      },
      select: {
        id: true,
        messageId: true,
        fileName: true,
        mimeType: true,
        size: true,
        data: true,
        message: {
          select: {
            spaceId: true,
          },
        },
      },
    });

    if (
      !attachment ||
      attachment.messageId !== messageId ||
      attachment.message.spaceId !== space.id
    ) {
      return NextResponse.json({ error: 'Attachment not found.' }, { status: 404 });
    }

    const body = attachment.data instanceof Uint8Array
      ? attachment.data
      : new Uint8Array(attachment.data);

    return new NextResponse(body, {
      headers: {
        'Content-Type': attachment.mimeType || 'application/octet-stream',
        'Content-Length': String(attachment.size),
        'Content-Disposition': `inline; filename="${sanitizeFileName(attachment.fileName)}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load attachment' },
      { status: 500 }
    );
  }
}
