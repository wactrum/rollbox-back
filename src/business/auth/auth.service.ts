import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/business/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthDto, RegisterDto } from '@/business/auth/dto/auth.dto';
import { MailService } from '@/infrastructure/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PhoneConfirmationService } from '@/business/auth/phone.confirmation.service';
import { UAParser } from 'ua-parser-js';
import { UserEntity } from '@/business/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private confirmationService: PhoneConfirmationService
  ) {}

  async validateAuth(data: AuthDto): Promise<any> {
    const user = await this.usersService.findConfirmedByPhone(data.phone);

    if (!user) {
      throw new UnauthorizedException();
    }

    const match = await argon2.verify(user.password, data.password);

    if (match) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException();
  }

  async login(user: any, userAgent?: string) {
    const { accessToken, refreshToken } = await this.getTokens(user.id, user.phone, user.cart.id);

    await this.updateRefreshTokens(user.id, refreshToken, userAgent);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return this.confirmationService.sendConfirmationCode(user.id, user.phone);
  }

  async refreshTokens(refreshToken: string, userAgent?: string) {
    const decode = this.jwtService.decode(refreshToken);
    const userId = decode?.sub;
    if (!userId) throw new ForbiddenException('Access Denied');

    const user = await this.usersService.findWithRefresh(userId);
    const userTokens = user.refreshTokens;
    const isExists = !!userTokens.length;

    if (!isExists) throw new ForbiddenException('Access Denied');

    const verifyPromises = userTokens.map((item) => argon2.verify(item.token, refreshToken));
    const verifyResults = await Promise.all(verifyPromises);
    const refreshTokenMatches = verifyResults.some((result) => result === true);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.cart.id);
    await this.updateRefreshTokens(user.id, tokens.refreshToken, userAgent);
    return tokens;
  }

  async getTokens(userId: number, phone: string, cartId: number) {
    const payload = { id: userId, phone, cartId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '24h',
        secret: this.configService.get('JWT_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshTokens(userId: number, refreshToken: string, userAgent?: string) {
    const parser = new UAParser(userAgent);
    const userAgentData = parser.getResult();
    const simplifiedUserAgent = `${userAgentData.os.name} ${userAgentData.browser.name} ${userAgentData.browser.version}`;

    const [hashedRefreshToken, userTokens] = await Promise.all([
      argon2.hash(refreshToken),
      this.usersService.getRefreshTokens(userId),
    ]);

    const existsToken = userTokens.find((el) => el.userAgent === simplifiedUserAgent);

    if (existsToken) {
      return this.usersService.updateRefreshToken(existsToken.id, hashedRefreshToken);
    }

    const addTokenPromise = this.usersService.addRefreshToken({
      userId,
      token: hashedRefreshToken,
      userAgent: simplifiedUserAgent,
    });

    if (userTokens.length >= 4) {
      return Promise.all([
        addTokenPromise,
        this.usersService.deleteRefreshToken(userTokens.at(0).id),
      ]);
    }

    return addTokenPromise;
  }
}
