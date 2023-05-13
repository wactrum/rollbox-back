import { Cart, ProductsOnCart } from '@prisma/client';
import { ProductEntity } from '@/business/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProductsOnCartEntity implements ProductsOnCart {
  addetAt: Date;
  cartId: number;
  productId: number;
  quantity: number;

  @ApiProperty({ type: ProductEntity })
  product: ProductEntity;
}

export class CartEntity implements Cart {
  id: number;
  userId: number;

  @ApiProperty({ type: ProductsOnCartEntity, isArray: true })
  products: ProductsOnCartEntity[];
}
