import { IsMobilePhone, IsNotEmpty } from 'class-validator';
import { TransformToDigits } from '@/utils/transform/string.transform';

export class ConfirmDto {
  @IsNotEmpty()
  @IsMobilePhone('ru-RU')
  @TransformToDigits()
  phone: string;

  @IsNotEmpty()
  code: string;
}

export class ConfirmResetPasswordDto {
  @IsNotEmpty()
  @IsMobilePhone('ru-RU')
  @TransformToDigits()
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  code: string;
}
