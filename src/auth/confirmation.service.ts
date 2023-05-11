import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mail/mail.service';
import { UsersService } from '@/users/users.service';
import { SmsService } from '@/sms/sms.service';

@Injectable()
export class ConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: MailService,
    private readonly smsService: SmsService,
    private readonly usersService: UsersService
  ) {}

  async sendVerificationSms(phone: string, code: string) {
    const text = `Для подтверждения входа в Rollbox пожалуйста введте код: ${code}`;
    return this.smsService.send({
      phone,
      message: text,
    });
  }

  async sendVerificationLink(email: string, name: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_EMAIL_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME'),
    });
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;

    this.emailService.sendUserConfirmation(email, name, url);
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email, user.name);
  }
}
