import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { AuthController } from '@/auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { MailModule } from '@/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PhoneConfirmationService } from '@/auth/phone.confirmation.service';
import { PhoneConfirmationController } from '@/auth/phone.confirmation.controller';
import { JwtAuthSocketGuard } from '@/auth/guards/jwt-auth.socket.guard';
import { SmsModule } from '@/sms/sms.module';
import { PasswordService } from '@/auth/password.service';
import { PasswordController } from '@/auth/password.controller';

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
