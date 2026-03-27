import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeedData } from '@/lib/db/seed';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  try {
    await ensureSeedData();

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

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
      { error: error instanceof Error ? error.message : 'Unable to load profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  try {
    await ensureSeedData();

    const { name, phone, department, avatar_url } = await request.json();

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: {
        ...(name !== undefined ? { name: String(name) } : {}),
        ...(phone !== undefined ? { phone: phone ? String(phone) : null } : {}),
        ...(department !== undefined ? { department: department ? String(department) : null } : {}),
        ...(avatar_url !== undefined ? { avatarUrl: avatar_url ? String(avatar_url) : null } : {}),
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
      { error: error instanceof Error ? error.message : 'Unable to update profile' },
      { status: 500 }
    );
  }
}
