import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/business/auth/strategies/local.strategy';
import { AuthController } from '@/business/auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/business/auth/strategies/jwt.strategy';
import { MailModule } from '@/infrastructure/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PhoneConfirmationService } from '@/business/auth/phone.confirmation.service';
import { PhoneConfirmationController } from '@/business/auth/phone.confirmation.controller';
import { JwtAuthSocketGuard } from '@/business/auth/guards/jwt-auth.socket.guard';
import { SmsModule } from '@/infrastructure/sms/sms.module';
import { PasswordService } from '@/business/auth/password.service';
import { PasswordController } from '@/business/auth/password.controller';
import { CartModule } from '@/business/cart/cart.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        };
      },
    }),
    MailModule,
    SmsModule,
  ],
  providers: [
    AuthService,
    PhoneConfirmationService,
    PasswordService,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    JwtAuthSocketGuard,
  ],
  controllers: [AuthController, PasswordController, PhoneConfirmationController],
  exports: [JwtAuthSocketGuard, JwtService],
})
export class AuthModule {}
