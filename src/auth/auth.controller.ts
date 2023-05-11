import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthDto,
  CodeResponseDto,
  LoginResponseDto,
  RefreshTokenDto,
  RegisterDto,
} from '@/auth/dto/auth.dto';
import { AuthService } from '@/auth/auth.service';
import { ApiDefaultBadRequestResponse } from '@/utils/decorators/api';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Авторизация в системе
   */
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiDefaultBadRequestResponse()
  @Post('login')
  async login(@Request() req, @Body() body: AuthDto) {
    return this.authService.login(req.user, req.headers['user-agent']);
  }

  /**
   * Обновление токена
   */
  @ApiCreatedResponse({ type: LoginResponseDto })
  @Post('refresh-token')
  async refreshToken(@Request() req, @Body() body: RefreshTokenDto) {
    return this.authService.refreshTokens(body.token, req.headers['user-agent']);
  }

  /**
   * Регистрация
   */
  @ApiCreatedResponse({ type: CodeResponseDto })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
