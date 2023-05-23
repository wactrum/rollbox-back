import { Global, Logger, Module } from '@nestjs/common';
import { PrismaPaginationService } from '@/infrastructure/database/prisma/prisma.pagination.service';
import { PrismaModule as Prisma } from 'nestjs-prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    Prisma.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        if (configService.get('DATABASE_DEBUG')) {
          return {
            middlewares: [
              async (params, next) => {
                const logger = new Logger('PrismaModule');
                const before = Date.now();
                const result = await next(params);
                const after = Date.now();
                logger.debug(`Query ${params.model}.${params.action} took ${after - before} ms`);
                return result;
              },
            ],
          };
        }
      },
    }),
  ],
  providers: [PrismaPaginationService],
  exports: [PrismaPaginationService],
})
export class PrismaModule {}
