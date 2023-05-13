import { PaginationQueryDto } from '@/infrastructure/database/prisma/dto/pagination.dto';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetOrdersDto extends PaginationQueryDto {}
