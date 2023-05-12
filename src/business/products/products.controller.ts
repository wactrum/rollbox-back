import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';
import { Permission } from '@/business/auth/permission.service';
import { ProductEntity } from '@/business/products/entities/product.entity';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permissions(Permission.CREATE_PRODUCTS)
  @ApiCreatedResponse({ type: ProductEntity })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Permissions(Permission.UPDATE_PRODUCT)
  @ApiOkResponse({ type: ProductEntity })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Permissions(Permission.DELETE_PRODUCT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
