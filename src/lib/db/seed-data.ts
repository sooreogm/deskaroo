import type { Prisma } from '@prisma/client';

type SeedUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: string;
  teamId?: string;
  emailVerifiedAt?: Date;
  emailVerificationRequired?: boolean;
  passwordHash?: string;
};

type SeedRoom = Prisma.RoomCreateManyInput;

type SeedDesk = Prisma.DeskCreateManyInput;

export const seedUsers: SeedUser[] = [
  {
    id: 'admin-3',
    name: 'Sooreoluwa',
    email: 'sooreoluwa@klarnow.co.uk',
    department: 'Leadership',
    role: 'admin',
    teamId: 'team-2',
    emailVerifiedAt: new Date(),
    emailVerificationRequired: false,
    passwordHash:
      '999a42add1562d7f2f5b2a691bfc09d4:840f00a44788bb1a6361aea95a2ad2462b22792beb26d95a43a7ed2d5c07824d32af96b82c473d07d91a9953debdc3cdda7185c42b42ad54330d9a736349a647',
  },
];

export const seedRooms: SeedRoom[] = [];

export const seedDesks: SeedDesk[] = [];
