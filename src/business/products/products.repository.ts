import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';
import { GetProductsDto } from '@/business/products/dto/get-products.dto';
import { Product, Prisma } from '@prisma/client';
import { PrismaPaginationService } from '@/infrastructure/database/prisma/prisma.pagination.service';

@Injectable()
export class ProductsRepository {
  sortableFields: Array<keyof Product> = [
    'id',
    'name',
    'description',
    'price',
    'discount',
    'categoryId',
  ];
  select = {
    id: true,
    name: true,
    description: true,
    price: true,
    discount: true,
    categoryId: true,
    category: true,
  };

  constructor(
    private prismaService: PrismaService,
    private prismaPaginationService: PrismaPaginationService
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.prismaService.product.create({
      data: createProductDto,
    });
  }

  async findWithPagination(params: GetProductsDto) {
    const query = this.prismaPaginationService.getPaginationQuery(params, this.sortableFields);

    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
      categoryId: params.categoryId,
    };

    const findPromise = this.prismaService.product.findMany({
      select: this.select,
      where,
      ...query,
    });

    return await Promise.all([findPromise, this.prismaService.product.count({ where })]);
  }

  findOne(id: number) {
    return this.prismaService.product.findFirst({ where: { id, isDeleted: false } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prismaService.product.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}
