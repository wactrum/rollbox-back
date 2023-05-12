import { Product as Model } from '@prisma/client';
import { ApiHideProperty } from '@nestjs/swagger';

export class ProductEntity implements Model {
  id: number;
  categoryId: number;
  description: string;
  discount: number;
  name: string;
  price: number;

  @ApiHideProperty()
  isDeleted: boolean;
}
