import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from '@/business/products/categories/categories.repository';
import { GetCategoriesWithProductsDto } from "@/business/products/categories/dto/get-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoriesRepository.create(createCategoryDto);
  }

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findAllWithProducts(dto: GetCategoriesWithProductsDto) {
    return this.categoriesRepository.findAllWithProducts(dto);
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.categoriesRepository.remove(id);
  }
}
