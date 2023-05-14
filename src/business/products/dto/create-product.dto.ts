import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { File } from 'fastify-multer/lib/interfaces';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsNumber()
  @IsNotEmpty()
  productImageId: number;
}

export class CreateProductImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: File;
}
