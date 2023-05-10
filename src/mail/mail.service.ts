import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * Send an email with an activate email link
   */
  async sendUserConfirmation(email: string, name: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Добро пожаловать, Подтвердите ваш Email | Timeceros',
      template: './confirmation',
      context: { name, url },
    });
  }

  /**
   * Send an email with a password reset link
   */
  async sendRestPasswordLink(email: string, name: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Сбросить пароль | Timeceros',
      template: './password-confirmation',
      context: { name, url },
    });
  }
}
