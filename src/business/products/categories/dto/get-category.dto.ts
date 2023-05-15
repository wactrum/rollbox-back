import { IsOptional, IsString } from 'class-validator';

export class GetCategoriesWithProductsDto {
  @IsOptional()
  @IsString()
  search: string;
}
