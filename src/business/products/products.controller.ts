import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, CreateProductImageDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';
import { Permission } from '@/business/auth/permission.service';
import { ProductEntity } from '@/business/products/entities/product.entity';
import { GetProductsDto } from '@/business/products/dto/get-products.dto';
import { ApiPaginatedResponse } from '@/infrastructure/database/prisma/decorators/pagination.decorator';
import { createBaseImageFileInterceptor } from '@/utils/files/interceptors/base-image-file.interceptor';
import { File } from 'fastify-multer/lib/interfaces';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions(Permission.CREATE_PRODUCTS)
  @ApiCreatedResponse({ type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('image/upload')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions(Permission.CREATE_PRODUCTS, Permission.UPDATE_PRODUCT)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(createBaseImageFileInterceptor('./uploads/products'))
  uploadImage(@Body() uploadImageDto: CreateProductImageDto, @UploadedFile() file: File) {
    return this.productsService.createFile({
      file,
    });
  }

  @Get()
  @ApiPaginatedResponse(ProductEntity)
  findAll(@Query() query: GetProductsDto) {
    return this.productsService.findAllWithPagination(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions(Permission.UPDATE_PRODUCT)
  @ApiOkResponse({ type: ProductEntity })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions(Permission.DELETE_PRODUCT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
