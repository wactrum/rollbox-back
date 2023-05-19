import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'nestjs-prisma';
import { GetCategoriesWithProductsDto } from '@/business/products/categories/dto/get-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private prismaService: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prismaService.category.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findAllWithProducts(query: GetCategoriesWithProductsDto) {
    return this.prismaService.category.findMany({
      include: {
        products: {
          where: {
            isDeleted: false,

            OR: query.search && [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          },
          include: {
            productImage: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prismaService.category.delete({
      where: { id },
    });
  }
}
