import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';
import { Permission } from '@/business/auth/permission.service';
import { CategoryEntity } from '@/business/products/categories/entities/category.entity';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
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

  @Get(':id')
  @ApiOkResponse({ type: CategoryEntity })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @Permissions(Permission.UPDATE_CATEGORY)
  @ApiOkResponse({ type: CategoryEntity })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Permissions(Permission.DELETE_CATEGORY)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
