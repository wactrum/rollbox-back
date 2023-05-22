import { Injectable } from '@nestjs/common';
import { CreateProductDto, CreateProductImageDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';
import { GetAdminProductsDto, GetProductsDto } from '@/business/products/dto/get-products.dto';
import { Product, Prisma, Provider } from '@prisma/client';
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
  select: Prisma.ProductSelect = {
    id: true,
    name: true,
    description: true,
    price: true,
    discount: true,
    categoryId: true,
    category: true,
    productImage: true,
  };

  constructor(
    private prismaService: PrismaService,
    private prismaPaginationService: PrismaPaginationService
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.prismaService.product.create({
      data: createProductDto,
      include: { productImage: true, category: true },
    });
  }

  async createFile(createFileDto: CreateProductImageDto) {
    return this.prismaService.productImage.create({
      data: {
        path: createFileDto.file.path,
        provider: Provider.LOCAL,
      },
    });
  }

  async findWithPagination(params: GetProductsDto | GetAdminProductsDto) {
    const query = this.prismaPaginationService.getPaginationQuery(params, this.sortableFields);
    const search = params.search;
    const isDeleted = params instanceof GetAdminProductsDto ? params.showDeleted : false;

    const where: Prisma.ProductWhereInput = {
      isDeleted,
      categoryId: params.categoryId,

      OR: search && [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search } } },
      ],
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
      include: { productImage: true, category: true },
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
