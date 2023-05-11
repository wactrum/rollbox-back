import { IsMobilePhone, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

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
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class AttachRoleDto {
  @IsNotEmpty()
  roles: number[];
}
