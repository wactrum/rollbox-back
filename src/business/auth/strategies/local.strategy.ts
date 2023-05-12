import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/business/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phone' });
  }

  async validate(phone: string, password: string): Promise<any> {
    phone = phone.replace('+', '');
    const user = await this.authService.validateUser(phone, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
