import { Product as Model, ProductImage, Provider } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ProductImageEntity implements ProductImage {
  id: number;
  path: string;

  @ApiProperty({ enum: Provider })
  provider: Provider;
}

export class ProductEntity implements Model {
  id: number;
  categoryId: number;
  description: string;
  discount: number;
  name: string;
  price: number;

  @ApiHideProperty()
  isDeleted: boolean;

  @ApiHideProperty()
  productImageId: number;

  @ApiProperty({ type: ProductImageEntity })
  productImage?: ProductImageEntity;
}
