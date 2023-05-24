import { PrismaClient } from '@prisma/client';
import { Permission } from '@/business/auth/permission.service';

const baseRoles = [
  {
    name: 'Admin',
    permissions: Object.values(Permission),
  },
];

export async function seedRoles(prisma: PrismaClient) {
  for (const role of baseRoles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        permissions: {
          connectOrCreate: role.permissions.map((el) => ({
            where: {
              name: el,
            },
            create: {
              name: el,
            },
          })),
        },
      },
      create: {
        name: role.name,
        permissions: {
          connectOrCreate: role.permissions.map((el) => ({
            where: {
              name: el,
            },
            create: {
              name: el,
            },
          })),
        },
      },
    });
  }
  console.log(`✅ Seed ROLES inserted`);
}
