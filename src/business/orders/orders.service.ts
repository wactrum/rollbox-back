import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from '@/business/orders/orders.repository';
import { CartRepository } from '@/business/cart/cart.repository';
import { CartEntity, ProductsOnCartEntity } from '@/business/cart/entities/cart.entity';
import { GetOrdersDto } from '@/business/orders/dto/get-orders.dto';
import { GetProductsDto } from "@/business/products/dto/get-products.dto";
import { PageMetaDto, PaginatedResponseDto } from "@/infrastructure/database/prisma/dto/pagination.dto";

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository, private cartRepository: CartRepository) {}

  async createFromCart(cartId: number, createOrderDto: CreateOrderRequestDto) {
    const cart = await this.cartRepository.findById(cartId);
    this.validateCart(cart);
    const products = cart.products;
    const price = this.calculatePrice(products);
    const userId = cart.userId;
    const items = products.map((el) => ({
      discount: el.product.discount,
      price: el.product.price,
      productId: el.product.id,
      quantity: el.quantity,
    }));

    return this.ordersRepository.create({
      ...createOrderDto,
      price,
      userId: userId,
      items,
    });
  }

  private validateCart(cart: CartEntity) {
    if (!cart.products.length) {
      throw new BadRequestException('Cart is empty');
    }
  }

  private calculatePrice(products: ProductsOnCartEntity[]): number {
    let total = 0;

    for (const product of products) {
      const discountedPrice = product.product.price - product.product.discount;
      total += discountedPrice * product.quantity;
    }

    return total;
  }

  checkIsAuthor(userId: number, id: number) {
    return this.ordersRepository.checkIsAuthor(id, userId);
  }

  async findAllWithPagination(query: GetProductsDto) {
    const [data, count] = await this.ordersRepository.findAllWithPagination(query);

    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto: query });
    return new PaginatedResponseDto(data, pageMetaDto);
  }
  findOne(id: number) {
    return this.ordersRepository.findOne(id);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.ordersRepository.update(id, updateOrderDto);
  }

  remove(id: number) {
    return this.ordersRepository.remove(id);
  }
}
