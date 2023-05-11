import { Module } from '@nestjs/common';
import { SmsProvider } from '@/sms/providers/sms.provider.interface';
import { SmscService } from '@/sms/providers/redsms/smsc.service';
import { SmsService } from '@/sms/sms.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    SmsService,
    {
      provide: SmsProvider,
      useClass: SmscService,
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
