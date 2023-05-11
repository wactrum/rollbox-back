import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PhoneConfirmationService } from '@/auth/phone.confirmation.service';
import { ConfirmDto, ConfirmResetPasswordDto } from '@/auth/dto/confirm.dto';
import { CodeResponseDto, ResendRegisterSms } from '@/auth/dto/auth.dto';
import { PasswordService } from '@/auth/password.service';
import { UserEntity } from '@/users/entities/user.entity';
import { ApiDefaultBadRequestResponse } from '@/utils/decorators/api';

@Controller('password')
@ApiTags('auth')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  /**
   * Отправить код-подтверждение для сброса пароля
   */
  @Post('reset/send')
  @ApiCreatedResponse({ type: CodeResponseDto })
  @ApiDefaultBadRequestResponse()
  @ApiNotFoundResponse()
  async sendResetPasswordCode(@Body() body: ResendRegisterSms) {
    return this.passwordService.sendResetPasswordCode(body.phone);
  }

  /**
   * Повторно отправить код-подтверждение
   */
  @Post('reset/resend')
  @ApiCreatedResponse({ type: CodeResponseDto })
  async resendConfirmation(@Body() body: ResendRegisterSms) {
    return this.passwordService.resendConfirmationCode(body.phone);
  }

  /**
   * Подтвердить смену пароля
   * @param body
   */
  @ApiCreatedResponse()
  @Post('reset/confirm')
  async register(@Body() body: ConfirmResetPasswordDto) {
    return this.passwordService.confirmResetPassword(body);
  }
}
