import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { seedDesks, seedRooms, seedUsers } from '@/lib/db/seed-data';

let seedPromise: Promise<void> | null = null;
const SEEDED_ADMIN_EMAIL = 'sooreoluwa@klarnow.co.uk';

const createSeedBookings = () => {
  return [];
};

const seedDatabase = async () => {
  const seedBookings = createSeedBookings();
  const [seedUserCount, seedRoomCount, seedDeskCount, seedBookingCount] = await Promise.all([
    prisma.user.count({
      where: {
        email: {
          in: seedUsers.map((user) => user.email),
        },
      },
    }),
    prisma.room.count({
      where: {
        id: {
          in: seedRooms.map((room) => room.id),
        },
      },
    }),
    prisma.desk.count({
      where: {
        id: {
          in: seedDesks.map((desk) => desk.id),
        },
      },
    }),
    prisma.booking.count({
      where: {
        id: {
          in: seedBookings.map((booking) => booking.id),
        },
      },
    }),
  ]);

  const hasCompleteSeedData =
    seedUserCount === seedUsers.length &&
    seedRoomCount === seedRooms.length &&
    seedDeskCount === seedDesks.length &&
    seedBookingCount === seedBookings.length;

  if (hasCompleteSeedData) {
    return;
  }

  const defaultPasswordHash = await hashPassword('demo1234');
  const usersToCreate = seedUsers.map(({ passwordHash, ...user }) => ({
    ...user,
    passwordHash: passwordHash ?? defaultPasswordHash,
  }));
  const seededAdmin = usersToCreate.find((user) => user.email === SEEDED_ADMIN_EMAIL);

  await prisma.user.createMany({
    data: usersToCreate,
    skipDuplicates: true,
  });

  if (seededAdmin) {
    await prisma.user.updateMany({
      where: {
        email: SEEDED_ADMIN_EMAIL,
      },
      data: {
        name: seededAdmin.name,
        phone: seededAdmin.phone ?? null,
        department: seededAdmin.department ?? null,
        role: seededAdmin.role,
        teamId: seededAdmin.teamId ?? null,
        emailVerifiedAt: seededAdmin.emailVerifiedAt ?? null,
        emailVerificationRequired: seededAdmin.emailVerificationRequired ?? false,
      },
    });
  }

  if (seedRooms.length > 0) {
    await prisma.room.createMany({
      data: seedRooms,
      skipDuplicates: true,
    });
  }

  if (seedDesks.length > 0) {
    await prisma.desk.createMany({
      data: seedDesks,
      skipDuplicates: true,
    });
  }

  if (seedBookings.length > 0) {
    await prisma.booking.createMany({
      data: seedBookings,
      skipDuplicates: true,
    });
  }
};

export const ensureSeedData = async () => {
  if (!seedPromise) {
    seedPromise = seedDatabase().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }

  await seedPromise;
};
