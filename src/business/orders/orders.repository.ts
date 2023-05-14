import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'nestjs-prisma';
import { PrismaPaginationService } from '@/infrastructure/database/prisma/prisma.pagination.service';
import { Order, Prisma } from '@prisma/client';
import { GetOrdersDto, GetUserOrdersDto } from "@/business/orders/dto/get-orders.dto";
import { CancelOrderDto } from '@/business/orders/dto/cancel-order.dto';

@Injectable()
export class OrdersRepository {
  sortableFields: Array<keyof Order> = [
    'id',
    'price',
    'userId',
    'deliveryLocationId',
    'location',
    'createdAt',
    'updatedAt',
    'status',
    'type',
  ];

  constructor(
    private prismaService: PrismaService,
    private prismaPaginationService: PrismaPaginationService
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const { items, ...data } = createOrderDto;
    return this.prismaService.order.create({
      data: {
        ...data,
        products: {
          createMany: {
            data: items,
          },
        },
      },
    });
  }

  async findAllWithPagination(params: GetOrdersDto) {
    const query = this.prismaPaginationService.getPaginationQuery(params, this.sortableFields);
    const search = params.search;

    let createdAt: Prisma.DateTimeFilter | undefined;
    if (params.createdAtFrom) {
      createdAt = {
        gte: params.createdAtFrom,
      };
    }
    if (params.createdAtTo) {
      createdAt = {
        ...createdAt,
        lte: params.createdAtTo,
      };
    }

    const where: Prisma.OrderWhereInput = {
      status: params.status,
      type: params.type,
      paymentType: params.paymentType,

      OR: [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { location: { contains: search, mode: 'insensitive' } },
      ],

      ...(createdAt && { createdAt }),
    };

    const findPromise = this.prismaService.order.findMany({
      where,
      include: { products: { include: { product: true } } },
      ...query,
    });

    return await Promise.all([findPromise, this.prismaService.order.count({ where })]);
  }

  async findByUserWithPagination(userId: number, params: GetUserOrdersDto) {
    const query = this.prismaPaginationService.getPaginationQuery(params, this.sortableFields);

    const where: Prisma.OrderWhereInput = {
      isDeleted: false,
    };

    const findPromise = this.prismaService.order.findMany({
      where,
      include: { products: { include: { product: true } } },
      ...query,
    });

    return await Promise.all([findPromise, this.prismaService.order.count({ where })]);
  }

  findOne(id: number) {
    return this.prismaService.order.findFirst({
      where: { id, isDeleted: false },
      include: { orderCancellations: true },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prismaService.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async checkIsAuthor(id: number, userId: number) {
    const data = await this.prismaService.order.findFirst({
      where: { id, userId, isDeleted: false },
    });
    return !!data;
  }

  remove(id: number) {
    return this.prismaService.order.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }

  createOrderCancellations(orderId: number, cancelOrderDto: CancelOrderDto) {
    return this.prismaService.orderCancellations.create({
      data: {
        orderId,
        description: cancelOrderDto.description,
      },
    });
  }
}
