import { Category as PrismaCategory } from '@prisma/client';

export class CategoryEntity implements PrismaCategory {
  id: number;
  name: string;
}
