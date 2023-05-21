import { PaginationQueryDto } from '@/infrastructure/database/prisma/dto/pagination.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;
}
