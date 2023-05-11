import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [RolesController],
  imports: [PrismaModule],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
