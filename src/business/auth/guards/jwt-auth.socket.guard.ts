import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtAuthSocketGuard implements CanActivate {
  constructor(private configService: ConfigService, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.query?.token as string;

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      if (decoded) {
        client['userId'] = decoded.id;
        client['email'] = decoded.email;
        return true;
      }
    } catch (err) {
      throw new WsException('jwt auth error');
    }

    return false;
  }
}
