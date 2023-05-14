import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto, CreateProductImageDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from '@/business/products/products.repository';
import { GetProductsDto } from '@/business/products/dto/get-products.dto';
import {
  PageMetaDto,
  PaginatedResponseDto,
} from '@/infrastructure/database/prisma/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  async createFile(createProductImageDto: CreateProductImageDto) {
    return this.productsRepository.createFile(createProductImageDto);
  }

  async findAllWithPagination(query: GetProductsDto) {
    const [data, count] = await this.productsRepository.findWithPagination(query);

    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto: query });
    return new PaginatedResponseDto(data, pageMetaDto);
  }

  findOne(id: number) {
    return this.productsRepository.findOne(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.remove(id);
  }
}
