import { Global, Module } from '@nestjs/common';
import { PrismaPaginationService } from '@/infrastructure/database/prisma/prisma.pagination.service';
import { PrismaModule as Prisma } from 'nestjs-prisma';

@Global()
@Module({
  imports: [
    Prisma.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaPaginationService],
  exports: [PrismaPaginationService],
})
export class PrismaModule {}
