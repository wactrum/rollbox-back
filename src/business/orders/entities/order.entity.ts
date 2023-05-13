import { Order, OrderStatuses, OrderType, PaymentTypes, ProductsOnOrders } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { DeliveryLocationEntity } from '@/business/delivery-locations/entities/delivery-location.entity';
import { ProductEntity } from '@/business/products/entities/product.entity';

export class ProductsOnOrdersEntity implements ProductsOnOrders {
  discount: number;
  id: number;
  orderId: number;
  price: number;
  productId: number;
  quantity: number;

  @ApiProperty({ type: ProductEntity })
  product: ProductEntity;
}

export class OrderEntity implements Order {
  id: number;
  userId: number;
  deliveryLocationId: number | null;
  location: string | null;
  price: number;
  @ApiProperty({ enum: PaymentTypes, nullable: true })
  paymentType: PaymentTypes | null;
  @ApiProperty({ enum: OrderStatuses })
  status: OrderStatuses;
  @ApiProperty({ enum: OrderType })
  type: OrderType;
  updatedAt: Date | null;
  createdAt: Date;

  @ApiProperty({ type: DeliveryLocationEntity })
  deliveryLocation: DeliveryLocationEntity;

  @ApiProperty({ type: ProductsOnOrdersEntity })
  products: ProductsOnOrdersEntity;

  @ApiHideProperty()
  isDeleted: boolean | null;
}
