import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from '@/business/auth/guards/local-auth.guard';
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
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiDefaultBadRequestResponse()
  @Post('login')
  async login(@Request() req, @Body() body: AuthDto) {
    return this.authService.login(req.user, req.headers['user-agent']);
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
