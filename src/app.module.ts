import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from '@/mail/mail.module';
import { RolesModule } from './roles/roles.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Libs
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    PrismaModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),

    // Utils
    MailModule,

    // Business
    UsersModule,
    AuthModule,
    RolesModule,
  ],
})
export class AppModule {}
