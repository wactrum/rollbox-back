import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/**
 * Guard for auth user on email/password
 */
export class LocalAuthGuard extends AuthGuard('local') {}
