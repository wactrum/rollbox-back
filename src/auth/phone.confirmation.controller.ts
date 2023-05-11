import { Request, Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PhoneConfirmationService } from '@/auth/phone.confirmation.service';
import { ConfirmDto } from '@/auth/dto/confirm.dto';
import { CodeResponseDto, ResendRegisterSms } from '@/auth/dto/auth.dto';
import { AuthService } from '@/auth/auth.service';

@Controller('phone')
@ApiTags('auth')
export class PhoneConfirmationController {
  constructor(
    private readonly confirmationService: PhoneConfirmationService,
    private readonly authService: AuthService
  ) {}

  @ApiOkResponse({ status: 200 })
  @Post('confirm')
  async register(@Request() req, @Body() body: ConfirmDto) {
    const user = await this.confirmationService.confirmPhone(body.phone, body.code);
    return this.authService.login(user, req.headers['user-agent']);
  }

  /**
   * Повторно отправить код-подтверждение
   */
  @Post('resend-confirmation')
  @ApiCreatedResponse({ status: 201, type: CodeResponseDto })
  async resendConfirmation(@Body() body: ResendRegisterSms) {
    return this.confirmationService.resendConfirmationCode(body.phone);
  }
}
