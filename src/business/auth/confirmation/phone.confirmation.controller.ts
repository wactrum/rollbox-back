import { Request, Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PhoneConfirmationService } from '@/business/auth/confirmation/phone.confirmation.service';
import { ConfirmDto } from '@/business/auth/dto/confirm.dto';
import { CodeResponseDto, ResendRegisterSms } from '@/business/auth/dto/auth.dto';
import { AuthService } from '@/business/auth/auth.service';

@Controller('phone')
@ApiTags('auth')
export class PhoneConfirmationController {
  constructor(
    private readonly confirmationService: PhoneConfirmationService,
    private readonly authService: AuthService
  ) {}

  /**
   * Confirm phone and end registration
   */
  @ApiOkResponse({ status: 200 })
  @Post('confirm')
  async register(@Request() req, @Body() body: ConfirmDto) {
    const user = await this.confirmationService.confirmPhone(body.phone, body.code);
    return this.authService.login(user, req.headers['user-agent']);
  }

  /**
   * Resend verification phone code
   */
  @Post('resend-confirmation')
  @ApiCreatedResponse({ status: 201, type: CodeResponseDto })
  async resendConfirmation(@Body() body: ResendRegisterSms) {
    return this.confirmationService.resendConfirmationCode(body.phone);
  }
}
