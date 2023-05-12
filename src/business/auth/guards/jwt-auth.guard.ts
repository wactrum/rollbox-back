import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/**
 * Guard for check user JWT auth
 */
export class JwtAuthGuard extends AuthGuard('jwt') {}
