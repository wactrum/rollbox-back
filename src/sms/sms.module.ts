import { Module } from '@nestjs/common';
import { SmsProvider } from '@/sms/providers/sms.provider.interface';
import { GreensmsService } from '@/sms/providers/greensms/greensms.service';
import { SmsService } from '@/sms/sms.service';
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
