import { Category as PrismaCategory } from '@prisma/client';
import { ProductEntity } from '@/business/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity implements PrismaCategory {
  id: number;
  name: string;

  @ApiProperty({ type: ProductEntity, isArray: true, nullable: true })
  products?: ProductEntity;
}
