import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductDto, CreateProductImageDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from '@/business/products/products.repository';
import { GetAdminProductsDto, GetProductsDto } from '@/business/products/dto/get-products.dto';
import {
  PageMetaDto,
  PaginatedResponseDto,
} from '@/infrastructure/database/prisma/dto/pagination.dto';
import { UsersService } from '@/business/users/users.service';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { CacheTypes } from '@/infrastructure/cache/cache.dto';
import { Permission } from '@/business/auth/permission.service';

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private userService: UsersService,
    protected cacheService: CacheService
  ) {}

  async create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  async createFile(createProductImageDto: CreateProductImageDto) {
    return this.productsRepository.createFile(createProductImageDto);
  }

  async findAllWithPagination(query: GetProductsDto | GetAdminProductsDto) {
    const [data, count] = await this.productsRepository.findWithPagination(query);

    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto: query });
    return new PaginatedResponseDto(data, pageMetaDto);
  }

  async findAllWithAdminQuery(query: GetAdminProductsDto, userId: number) {
    await this.checkAccessToAdminQuery(query, userId);
    return this.findAllWithPagination(query);
  }

  async checkAccessToAdminQuery(query: GetAdminProductsDto, userId: number) {
    if (query.showDeleted) {
      const userPermissions = await this.cacheService.getOrCache<string[]>(
        CacheTypes.PERMISSIONS,
        userId,
        () => this.userService.getAllPermissions(userId)
      );

      if (!userPermissions.includes(Permission.VIEW_DELETED_PRODUCTS)) {
        throw new ForbiddenException();
      }
    }
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
