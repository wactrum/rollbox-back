import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { AuthController } from '@/auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { MailModule } from '@/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfirmationService } from '@/auth/confirmation.service';
import { ConfirmationController } from '@/auth/confirmation.controller';
import { JwtAuthSocketGuard } from '@/auth/guards/jwt-auth.socket.guard';
import { SmsModule } from '@/sms/sms.module';

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
    ConfirmationService,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    JwtAuthSocketGuard,
  ],
  controllers: [AuthController, ConfirmationController],
  exports: [JwtAuthSocketGuard, JwtService],
})
export class AuthModule {}
