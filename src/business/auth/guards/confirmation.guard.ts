import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Guard for check user confirm phone
 */
@Injectable()
export class PhoneConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.user?.isPhoneConfirmed) {
      throw new UnauthorizedException('Confirm your email first');
    }

    return true;
  }
}
