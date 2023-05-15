import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/business/users/users.service';
import { SmsService } from '@/infrastructure/sms/sms.service';
import { ConfirmationService } from '@/business/auth/confirmation.service';
import { PhoneConfirmationType } from '@prisma/client';
import { CartService } from '@/business/cart/cart.service';

@Injectable()
export class PhoneConfirmationService extends ConfirmationService {
  type = PhoneConfirmationType.REGISTER;

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

  getText(code: any): string {
    const serviceName = this.configService.get('SERVICE_NAME');
    return `Для подтверждения регистрации на ${serviceName} введите код ${code}`;
  }
}
