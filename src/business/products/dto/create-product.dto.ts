import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
