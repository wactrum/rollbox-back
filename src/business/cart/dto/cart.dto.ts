import { IsInt, IsNotEmpty, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartDto {
  userId: number;
}

export class AddToCartRequestDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;
}

export class AddToCartDto {
  cartId: number;
  productId: number;
}

export class AddMultipleItemToCartDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class AddMultipleToCartRequestDto {
  @ValidateNested({ each: true })
  @Type(() => AddMultipleItemToCartDto)
  items: AddMultipleItemToCartDto[];
}

export class AddMultipleToCart {
  cartId: number;
  items: AddMultipleItemToCartDto[];
}

export class RemoveFromCartDto {
  cartId: number;
  productId: number;
}

export class GetProductFromCartQuantityDto {
  cartId: number;
  productId: number;
}

export class ClearCartDto {
  cartId: number;
}
