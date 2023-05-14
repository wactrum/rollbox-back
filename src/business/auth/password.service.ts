import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/business/users/users.service';
import { SmsService } from '@/infrastructure/sms/sms.service';
import { ConfirmationService } from '@/business/auth/confirmation.service';
import { PhoneConfirmationType } from '@prisma/client';
import { ConfirmResetPasswordDto } from '@/business/auth/dto/confirm.dto';

@Injectable()
export class PasswordService extends ConfirmationService {
  type = PhoneConfirmationType.PASSWORD_RESET;
  resendTime = 3;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly smsService: SmsService,
    protected readonly usersService: UsersService
  ) {
    super(configService, smsService, usersService);
  }

  async sendResetPasswordCode(phone: string) {
    phone = phone.replace('+', '');

    const user = await this.usersService.findByPhoneWithPasswordConfirmation(phone);

    if (!user) {
      throw new NotFoundException('Object not found');
    }

    const resetPasswordConfirmation = user.phoneConfirmation.at(0);

    if (resetPasswordConfirmation && !this.isValidResendTime(resetPasswordConfirmation.createdAt)) {
      throw new BadRequestException(`It's been less than ${this.resendTime} minutes`);
    }

    return super.sendConfirmationCode(user.id, phone);
  }

  async confirmResetPassword(data: ConfirmResetPasswordDto) {
    const { code, password } = data;
    const phone = data.phone.replace('+', '');

    const user = await this.usersService.findConfirmedByPhone(phone);

    if (!user) {
      throw new BadRequestException('Phone not confirmed or invalid');
    }

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

    await this.usersService.markPasswordResetUsed(phoneConfirmation.id);
    await this.usersService.update(user.id, {
      password,
    });
  }

  getText(code): string {
    const serviceName = this.configService.get('SERVICE_NAME');
    return `Для сброса пароля на сервисе ${serviceName} введите код ${code}`;
  }
}
