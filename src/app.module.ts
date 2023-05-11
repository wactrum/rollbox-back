import { Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from '@/mail/mail.module';
import { RolesModule } from './roles/roles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SmsModule } from './sms/sms.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    // Business
    AuthModule,
    UsersModule,
    RolesModule,

    // Utils
    MailModule,
    SmsModule,
    CacheModule,

    // Libs
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    PrismaModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 10,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
