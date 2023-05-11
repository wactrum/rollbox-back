import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfirmResetPasswordDto, RegisterDto, ResetPasswordDto } from '@/auth/dto/auth.dto';
import { MailService } from '@/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { ConfirmationService } from '@/auth/confirmation.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private confirmationService: ConfirmationService
  ) {}

  async login(user: any) {
    const { accessToken, refreshToken } = await this.getTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  generateRandomCode() {
    return Math.random().toString().slice(2, 6);
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const code = this.generateRandomCode();
    await Promise.all([
      this.usersService.createPhoneConfirmation({
        code,
        userId: user.id,
      }),
      this.confirmationService.sendVerificationSms(user.phone, code),
    ]);
    return;
  }

  async sendResetPasswordLink(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);

    if (user) {
      const token = this.jwtService.sign(
        { email: user.email },
        {
          secret: this.configService.get('JWT_EMAIL_VERIFICATION_TOKEN_SECRET'),
          expiresIn: this.configService.get('JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME'),
        }
      );
      const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;
      this.emailService.sendRestPasswordLink(user.email, user.name, url);
    } else {
      throw new BadRequestException('email not exists');
    }

    return;
  }

  async confirmResetPassword(resetPasswordDto: ConfirmResetPasswordDto) {
    const { token, email } = resetPasswordDto;

    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
          throw new BadRequestException('email not exists');
        } else {
          this.usersService.update(user.id, {
            password: await argon2.hash(resetPasswordDto.password),
          });
          return;
        }
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw error;
    }
    return;
  }

  /**
   * Проверка доступа по логину/паролю
   * @param email
   * @param password
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Bad data');
    }

    const match = await argon2.verify(user.password, password);
    if (match) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshTokens(refreshToken: string) {
    const { sub } = this.jwtService.decode(refreshToken);

    const user = await this.usersService.findRefreshById(sub);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: number, email: string) {
    const payload = { email: email, sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '5s',
        secret: this.configService.get('JWT_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '30s',
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.setRefreshToken(userId, hashedRefreshToken);
  }
}
