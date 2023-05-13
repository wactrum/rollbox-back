import { IsDefined, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { OrderStatuses, OrderType, PaymentTypes } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderRequestDto {
  @ValidateIf((o) => o.type === OrderType.DELIVERY)
  @IsDefined()
  deliveryLocationId: number;

  @ValidateIf((o) => o.type === OrderType.DELIVERY)
  location: string | null;

  @IsEnum(OrderType)
  @ApiProperty({ enum: OrderType })
  type: OrderType;

  @IsOptional()
  @IsEnum(PaymentTypes)
  @ApiProperty({ enum: PaymentTypes, nullable: true })
  paymentType: PaymentTypes | null;
}

export class CreateOrderItemsDto {
  discount: number;
  price: number;
  productId: number;
  quantity: number;
}

export class CreateOrderDto {
  userId: number;
  deliveryLocationId: number | null;
  location: string | null;
  price: number;
  paymentType: PaymentTypes | null;
  type: OrderType;

  items: CreateOrderItemsDto[];
}
