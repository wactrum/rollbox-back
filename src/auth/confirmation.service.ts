import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { SmsService } from '@/sms/sms.service';
import { PhoneConfirmationType } from '@prisma/client';

export abstract class ConfirmationService {
  abstract type: PhoneConfirmationType;
  protected resendTime = 2;

  protected constructor(
    protected readonly configService: ConfigService,
    protected readonly smsService: SmsService,
    protected readonly usersService: UsersService
  ) {}

  protected generateRandomCode() {
    return Math.random().toString().slice(2, 6);
  }

  abstract getText(code): string;

  protected async sendSms(phone: string, code: string) {
    return this.smsService.send({
      phone,
      message: this.getText(code),
    });
  }

  async sendConfirmationCode(userId: number, phone: string) {
    const code = this.generateRandomCode();

    await Promise.all([
      this.usersService.createOrUpdatePhoneConfirmation({
        code,
        userId,
        type: this.type,
      }),
      this.sendSms(phone, code),
    ]);

    if (this.configService.get('SMS_DEBUG')) {
      return {
        code,
      };
    }
  }

  protected isValidResendTime(oldTime: Date) {
    const currentDate = new Date();
    oldTime.setMinutes(oldTime.getMinutes() + this.resendTime);

    return currentDate >= oldTime;
  }

  async resendConfirmationCode(phone: string) {
    phone = phone.replace('+', '');
    const phoneConfirmation = await this.usersService.findPhoneConfirmation(phone, this.type);

    if (!phoneConfirmation) {
      throw new BadRequestException('No resend codes found');
    }

    if (this.isValidResendTime(phoneConfirmation.createdAt)) {
      return this.sendConfirmationCode(phoneConfirmation.userId, phoneConfirmation.code);
    } else {
      throw new BadRequestException(`It's been less than ${this.resendTime} minutes`);
    }
  }
}
