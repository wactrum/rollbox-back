import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SendSmsDto, SmsProvider } from '@/sms/providers/sms.provider.interface';

@Injectable()
export class GreensmsService extends SmsProvider implements OnModuleInit {
  logger = new Logger('GreenSmsService');
  client: AxiosInstance;
  token: string;

  constructor(private configService: ConfigService) {
    super();

    this.client = axios;
    this.client.defaults.baseURL = 'https://api3.greensms.ru';
  }

  async onModuleInit() {
    await this.login();
  }

  async login() {
    const login = this.configService.get('SMS_GREENSMS_LOGIN');
    const password = this.configService.get('SMS_GREENSMS_PASSWORD');

    try {
      const {
        data: { access_token },
      } = await this.client.post('/account/token', {
        user: login,
        pass: password,
      });

      this.token = access_token;
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      this.logger.debug('Success auth for provider');
    } catch (e) {
      console.warn(e);
    }
  }

  getName(): string {
    return 'GreenSMS';
  }

  /**
   * Send sms
   */
  async send(data: SendSmsDto): Promise<void> {
    return this.client.post('/sms/send', {
      to: data.phone,
      txt: data.message,
    });
  }
}
