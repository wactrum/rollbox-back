import { Injectable } from '@nestjs/common';
import {
  AddMultipleToCart,
  AddToCartDto,
  CreateCartDto,
  GetProductFromCartQuantityDto,
  RemoveFromCartDto,
} from './dto/cart.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CartRepository {
  constructor(private prismaService: PrismaService) {}

  create(createCartDto: CreateCartDto) {
    return this.prismaService.cart.create({
      data: createCartDto,
    });
  }

  findById(id: number) {
    return this.prismaService.cart.findUnique({
      where: { id },
      include: { products: { include: { product: true } } },
    });
  }

  addProductToCart(data: AddToCartDto) {
    return this.prismaService.productsOnCart.upsert({
      where: {
        cartId_productId: {
          productId: data.productId,
          cartId: data.cartId,
        },
      },
      create: {
        cartId: data.cartId,
        productId: data.productId,
        quantity: 1,
      },
      update: {
        quantity: { increment: 1 },
      },
    });
  }

  addProductsToCart(data: AddMultipleToCart) {
    return this.prismaService.cart.update({
      where: { id: data.cartId },
      data: {
        products: {
          createMany: {
            data: data.items,
          },
        },
      },
    });
  }

  getProductFromCartQuantity(data: GetProductFromCartQuantityDto) {
    return this.prismaService.productsOnCart.findUnique({
      where: {
        cartId_productId: data,
      },
      select: { quantity: true },
    });
  }

  removeProductFromCart(data: RemoveFromCartDto) {
    return this.prismaService.productsOnCart.update({
      where: { cartId_productId: data },
      data: {
        quantity: { decrement: 1 },
      },
    });
  }

  deleteProductFromCart(data: RemoveFromCartDto) {
    return this.prismaService.productsOnCart.delete({
      where: { cartId_productId: data },
    });
  }

  clearCart(cartId: number) {
    return this.prismaService.cart.update({
      where: { id: cartId },
      data: {
        products: {
          deleteMany: {},
        },
      },
    });
  }
}
