import { PaginationQueryDto } from '@/infrastructure/database/prisma/dto/pagination.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CastToBoolean } from '@/utils/transform/bool.transform';

export class GetProductsDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;
}

export class GetAdminProductsDto extends GetProductsDto {
  @IsOptional()
  @IsBoolean()
  @CastToBoolean()
  showDeleted?: boolean;
}
