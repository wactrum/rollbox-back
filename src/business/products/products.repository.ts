import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProductsRepository {
  constructor(private prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prismaService.product.create({
      data: createProductDto,
    });
  }

  findAll() {
    return this.prismaService.product.findMany({
      where: { isDeleted: false },
    });
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
