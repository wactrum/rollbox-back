import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository } from '@/business/cart/cart.repository';
import { AddMultipleToCart, AddToCartDto, RemoveFromCartDto } from '@/business/cart/dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private cartRepository: CartRepository) {}

  create(userId: number) {
    return this.cartRepository.create({
      userId,
    });
  }

  findById(id: number) {
    return this.cartRepository.findById(id);
  }

  addProductToCart(data: AddToCartDto) {
    return this.cartRepository.addProductToCart(data);
  }

  async addProductsToCart(data: AddMultipleToCart) {
    const cart = await this.findById(data.cartId);
    if (cart.products.length) {
      throw new BadRequestException(
        'Cart already contains items, use the API to add one product at a time'
      );
    }

    return this.cartRepository.addProductsToCart(data);
  }

  async removeProductFromCart(data: RemoveFromCartDto) {
    const { quantity } = await this.cartRepository.getProductFromCartQuantity(data);

    if (quantity > 1) {
      return this.cartRepository.removeProductFromCart(data);
    } else {
      return this.cartRepository.deleteProductFromCart(data);
    }
  }

  async clearCart(cardId: number) {
    return this.cartRepository.clearCart(cardId);
  }
}
