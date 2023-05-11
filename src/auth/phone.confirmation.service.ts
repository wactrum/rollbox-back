import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { SmsService } from '@/sms/sms.service';
import { ConfirmationService } from '@/auth/confirmation.service';
import { PhoneConfirmationType } from '@prisma/client';

@Injectable()
export class PhoneConfirmationService extends ConfirmationService {
  type = PhoneConfirmationType.REGISTER;
  getText(code: any): string {
    return `Для подтверждения регистрации на RollBox введите код ${code}`;
  }

  constructor(
    protected readonly configService: ConfigService,
    protected readonly smsService: SmsService,
    protected readonly usersService: UsersService
  ) {
    super(configService, smsService, usersService);
  }

  async confirmPhone(phone: string, code: string) {
    phone = phone.replace('+', '');

    const phoneConfirmation = await this.usersService.findUnusedConfirmation(
      phone,
      code,
      this.type
    );

    if (!phoneConfirmation) {
      throw new BadRequestException('Code not valid');
    }

    if (phoneConfirmation.isUsed) {
      throw new BadRequestException('Already confirmed');
    }

    return this.usersService.markPhoneAsConfirmed(phone);
  }
}
