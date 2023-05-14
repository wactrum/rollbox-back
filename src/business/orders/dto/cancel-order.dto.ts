import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CancelOrderDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;
}
