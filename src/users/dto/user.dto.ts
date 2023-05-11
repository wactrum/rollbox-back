import { IsMobilePhone, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PhoneConfirmationType } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  @IsMobilePhone('ru-RU')
  phone: string;

  @IsNotEmpty()
  password: string;
}

export class CreatePhoneConfirmationDto {
  code: string;
  userId: number;
  type: PhoneConfirmationType;
}

export class CreateRefreshTokenDto {
  userAgent?: string;
  userId: number;
  token: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class AttachRoleDto {
  @IsNotEmpty()
  roles: number[];
}
