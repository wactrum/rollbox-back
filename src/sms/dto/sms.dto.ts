import { IsMobilePhone, IsPhoneNumber } from 'class-validator';

export class SendSmsDto {
  @IsPhoneNumber()
  phone: string;
  message: string;
}
