import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserEntity } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsEmail()
  email: string;

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
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;
}

export class ConfirmResetPasswordDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  token: string;
}
