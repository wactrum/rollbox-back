import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { ConfirmResetPasswordDto } from '@/business/auth/dto/confirm.dto';
import { CodeResponseDto, ResendRegisterSms } from '@/business/auth/dto/auth.dto';
import { PasswordService } from '@/business/auth/password.service';
import { ApiDefaultBadRequestResponse } from 'src/utils/swagger';

@Controller('password')
@ApiTags('auth')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  /**
   * Submit password reset verification code
   */
  @Post('reset/send')
  @ApiCreatedResponse({ type: CodeResponseDto })
  @ApiDefaultBadRequestResponse()
  @ApiNotFoundResponse()
  async sendResetPasswordCode(@Body() body: ResendRegisterSms) {
    return this.passwordService.sendResetPasswordCode(body.phone);
  }

  /**
   * Resend verification code
   */
  @Post('reset/resend')
  @ApiCreatedResponse({ type: CodeResponseDto })
  async resendConfirmation(@Body() body: ResendRegisterSms) {
    return this.passwordService.resendConfirmationCode(body.phone);
  }

  /**
   * Confirm password change
   */
  @ApiCreatedResponse()
  @Post('reset/confirm')
  async register(@Body() body: ConfirmResetPasswordDto) {
    return this.passwordService.confirmResetPassword(body);
  }
}
