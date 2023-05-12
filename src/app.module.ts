import { Module } from '@nestjs/common';
import { UsersModule } from '@/business/users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from '@/business/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from '@/infrastructure/mail/mail.module';
import { RolesModule } from '@/business/roles/roles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SmsModule } from '@/infrastructure/sms/sms.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@/infrastructure/cache/cache.module';
import { DeliveryLocationsModule } from '@/business/delivery-locations/delivery-locations.module';
import { CategoriesModule } from '@/business/products/categories/categories.module';
import { ProductsModule } from '@/business/products/products.module';

@Module({
  imports: [
    // Libs
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    PrismaModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 10,
    }),

    // Infrastructure
    MailModule,
    SmsModule,
    CacheModule,

    // Business
    AuthModule,
    UsersModule,
    RolesModule,
    DeliveryLocationsModule,
    CategoriesModule,
    ProductsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
