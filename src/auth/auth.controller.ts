import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthDto,
  ConfirmResetPasswordDto,
  LoginResponseDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from '@/auth/dto/auth.dto';
import { AuthService } from '@/auth/auth.service';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Авторизация в системе
   */
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: LoginResponseDto })
  @Post('login')
  async login(@Request() req, @Body() body: AuthDto) {
    return this.authService.login(req.user);
  }

  /**
   * Обновление токена
   */
  @ApiOkResponse({ type: LoginResponseDto })
  @Post('refresh-token')
  async refreshToken(@Request() req, @Body() body: RefreshTokenDto) {
    return this.authService.refreshTokens(body.token);
  }

  /**
   * Регистрация
   */
  @ApiCreatedResponse({ status: 201 })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  /**
   * Выслать письмо для сброса пароля
   */
  @ApiOkResponse({ status: 200 })
  @Post('send-reset-password')
  async sendResetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.sendResetPasswordLink(body);
  }

  /**
   * Подтвердить сброс пароля
   */
  @ApiOkResponse({ status: 200 })
  @Post('confirm-reset-password')
  async confirmResetPassword(@Body() body: ConfirmResetPasswordDto) {
    return this.authService.confirmResetPassword(body);
  }
}
