import { IsMobilePhone, IsNotEmpty } from 'class-validator';

export class ConfirmDto {
  @IsNotEmpty()
  @IsMobilePhone('ru-RU')
  phone: string;

  @IsNotEmpty()
  code: string;
}

export class ConfirmResetPasswordDto {
  @IsNotEmpty()
  @IsMobilePhone('ru-RU')
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  code: string;
}
