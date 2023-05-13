import { Controller, Get, Param, Delete, Body, Post, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddMultipleToCartRequestDto, AddToCartRequestDto } from '@/business/cart/dto/cart.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';
import { CartEntity } from '@/business/cart/entities/cart.entity';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOkResponse({ type: CartEntity })
  getCart(@Request() request) {
    return this.cartService.findById(request.user.cartId);
  }

  @Post('/add')
  addProductToCart(@Request() request, @Body() addToCartDto: AddToCartRequestDto) {
    return this.cartService.addProductToCart({
      cartId: request.user.cartId,
      productId: addToCartDto.productId,
    });
  }

  @Post('/add-many')
  addProductsToCart(@Request() request, @Body() addToCartDto: AddMultipleToCartRequestDto) {
    return this.cartService.addProductsToCart({
      cartId: request.user.cartId,
      items: addToCartDto.items,
    });
  }

  @Delete('/product/:productId')
  removeItem(@Request() request, @Param('productId') productId: string) {
    return this.cartService.removeProductFromCart({
      cartId: +request.user.cartId,
      productId: +productId,
    });
  }

  @Delete('/clear')
  clear(@Request() request) {
    return this.cartService.clearCart(request.user.cartId);
  }
}
