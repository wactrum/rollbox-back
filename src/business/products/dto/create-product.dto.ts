import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

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
  @Min(0)
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  price: number;
}
