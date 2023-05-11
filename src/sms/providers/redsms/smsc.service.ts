import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createHash } from 'crypto';
import { SendSmsDto, SmsProvider } from '@/sms/providers/sms.provider.interface';

@Injectable()
export class SmscService extends SmsProvider {
  apiUrl: string;
  sender: string;
  login: string;
  apiKey: string;

  constructor(private configService: ConfigService) {
    super();
    this.login = this.configService.get('SMS_REDSMS_LOGIN');
    this.apiKey = this.configService.get('SMS_REDSMS_KEY');
    this.apiUrl = 'https://smsc.ru/sys/send.php';
    this.sender = 'Rollbox';
  }

  getName(): string {
    return 'RedSMS';
  }

  /**
   * Send sms
   */
  async send(data: SendSmsDto): Promise<void> {
    const res = await axios.post(this.apiUrl, {
      sms: [
        {
          sender: this.sender,
          channel: 'digit',
          phone: data.phone,
          text: data.message,
        },
      ],
    });
    console.warn(res);
  }

  protected getHeaders(data: any = {}) {
    const keys = Object.keys(data);
    keys.sort();
    const sortedData = keys.map((key) => data[key]);
    const ts = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    return {
      login: this.login,
      ts: ts,
      sig: createHash('md5')
        .update(this.concatData(sortedData) + ts + this.apiKey)
        .digest('hex'),
    };
  }

  private concatData(data: any[]): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += data[i];
    }
    return result;
  }
}
