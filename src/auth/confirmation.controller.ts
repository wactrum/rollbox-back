import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ConfirmDto } from "@/auth/dto/confirm.dto";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { ConfirmationService } from "@/auth/confirmation.service";

@Controller('email-confirmation')
@ApiTags("auth")
export class ConfirmationController {
  constructor(
    private readonly emailConfirmationService: ConfirmationService
  ) {}

  /**
   * Подтвердить Email
   */
  @Post('confirm')
  @ApiOkResponse({status: 200})
  async confirm(@Body() confirmationData: ConfirmDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
    await this.emailConfirmationService.confirmEmail(email);
  }

  /**
   * Повторно отправить ссылку для подтверждения Email
   */
  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() request) {
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }
}
