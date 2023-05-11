import { PrismaClient } from '@prisma/client';
import { seedPermission } from './permissions';
import { seedRoles } from './roles';

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Start inserting data`);
  await seedPermission(prisma);
  await seedRoles(prisma);
  console.log(`✅ Seed data inserted ✅`);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
