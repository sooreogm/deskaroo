import { NextResponse } from 'next/server';
import { getAuthenticatedRequestUser } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';
import {
  getMaxProfilePictureSizeBytes,
  uploadProfilePictureToPocketBase,
} from '@/lib/pocketbase';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await ensureSeedData();

    const authenticatedUser = await getAuthenticatedRequestUser(request);

    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { userId } = await params;

    if (authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'You can only update your own profile image.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Select an image to upload.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed.' }, { status: 400 });
    }

    if (file.size <= 0) {
      return NextResponse.json({ error: 'The selected image is empty.' }, { status: 400 });
    }

    if (file.size > getMaxProfilePictureSizeBytes()) {
      return NextResponse.json(
        { error: 'Profile images must be 5MB or smaller.' },
        { status: 400 }
      );
    }

    const avatarUrl = await uploadProfilePictureToPocketBase({
      currentAvatarUrl: authenticatedUser.avatarUrl,
      file,
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({
      user_id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      avatar_url: user.avatarUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to upload profile image' },
      { status: 500 }
    );
  }
}
