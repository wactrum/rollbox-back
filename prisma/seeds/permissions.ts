import { PrismaClient } from '@prisma/client';
import { Permission } from "@/auth/permission.service";

const permissions = Object.values(Permission)

export async function seedPermission(prisma: PrismaClient) {
  for(const permission of permissions) {
    await prisma.permission.upsert({
      where: {name: permission},
      update: {},
      create: {name: permission},
    });
  }
  console.log(`✅ Seed PERMISSIONS inserted`);
}