import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';
import { Permission } from '@/business/auth/permission.service';
import { CategoryEntity } from '@/business/products/categories/entities/category.entity';
import { GetCategoriesWithProductsDto } from '@/business/products/categories/dto/get-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions(Permission.CREATE_CATEGORY)
  @ApiCreatedResponse({ type: CategoryEntity })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('/products')
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  findAllWithProducts(@Query() dto: GetCategoriesWithProductsDto) {
    return this.categoriesService.findAllWithProducts(dto);
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryEntity })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions(Permission.UPDATE_CATEGORY)
  @ApiOkResponse({ type: CategoryEntity })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions(Permission.DELETE_CATEGORY)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
