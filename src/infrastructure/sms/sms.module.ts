import { Module } from '@nestjs/common';
import { SmsProvider } from '@/infrastructure/sms/providers/sms.provider.interface';
import { GreensmsService } from '@/infrastructure/sms/providers/greensms/greensms.service';
import { SmsService } from '@/infrastructure/sms/sms.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    SmsService,
    {
      provide: SmsProvider,
      useClass: GreensmsService,
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
