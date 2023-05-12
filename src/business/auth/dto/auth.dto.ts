import { IsEmail, IsNotEmpty, IsMobilePhone } from 'class-validator';
import { UserEntity } from '@/business/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsMobilePhone('ru-RU')
  phone: string;

  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    type: UserEntity,
  })
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

export class RegisterDto {
  @IsMobilePhone('ru-RU')
  phone: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
}

export class ResendRegisterSms {
  @IsMobilePhone('ru-RU')
  phone: string;
}

export class CodeResponseDto {
  @ApiProperty({
    description: 'If enable debug on sms sending',
  })
  code?: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  token: string;
}
