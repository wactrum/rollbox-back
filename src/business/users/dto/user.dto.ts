import {
  IsDateString,
  IsMobilePhone,
  IsNotEmpty,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Genders, PhoneConfirmationType } from '@prisma/client';
import { IsDateLessThanToday } from '@/utils/validators/date.validators';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  @IsMobilePhone('ru-RU')
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsDateString()
  @IsDateLessThanToday()
  birthDate?: string;

  @IsOptional()
  @IsEnum(Genders)
  gender?: Genders;
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
