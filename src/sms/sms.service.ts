import { Injectable, Logger } from '@nestjs/common';
import { SendSmsDto } from '@/sms/dto/sms.dto';
import { validateOrReject } from 'class-validator';
import { SmsProvider } from '@/sms/providers/sms.provider.interface';

@Injectable()
export class SmsService {
  private readonly logger = new Logger('[SmsService]');
  constructor(private smsProvider: SmsProvider) {}

  async send(data: SendSmsDto) {
    try {
      await validateOrReject(data);
      //await this.smsProvider.send(data);
    } catch (e) {
      this.logger.error('Send sms error:', e.message);
      throw e;
    }
  }
}
