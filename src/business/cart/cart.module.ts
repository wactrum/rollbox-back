import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from '@/business/cart/cart.repository';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService, CartRepository],
})
export class CartModule {}
