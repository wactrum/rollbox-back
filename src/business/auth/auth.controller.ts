import { Controller, Request, Post, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthDto,
  CodeResponseDto,
  LoginResponseDto,
  RefreshTokenDto,
  RegisterDto,
} from '@/business/auth/dto/auth.dto';
import { AuthService } from '@/business/auth/auth.service';
import { ApiDefaultBadRequestResponse } from 'src/utils/swagger';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Authorization in the system
   */
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiDefaultBadRequestResponse()
  @Post('login')
  async login(@Request() req, @Body() body: AuthDto) {
    const user = this.authService.validateAuth(body);
    return this.authService.login(user, req.headers['user-agent']);
  }

  /**
   * Token refresh
   */
  @ApiCreatedResponse({ type: LoginResponseDto })
  @Post('refresh-token')
  async refreshToken(@Request() req, @Body() body: RefreshTokenDto) {
    return this.authService.refreshTokens(body.token, req.headers['user-agent']);
  }

  /**
   * Registration
   */
  @ApiCreatedResponse({ type: CodeResponseDto })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
