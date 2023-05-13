import { BadRequestException, Global, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@/infrastructure/database/prisma/dto/pagination.dto';

interface PaginationQuery<T extends object> {
  skip?: number;
  take?: number;
  orderBy?: {
    [K in keyof T]: 'asc' | 'desc';
  };
}

@Global()
@Injectable()
export class PrismaPaginationService {
  public getPaginationQuery<T extends object>(
    pageOptionsDto: PaginationQueryDto,
    sortableKeys: string[] = ['id']
  ): PaginationQuery<T> {
    const { sortBy, sortOrder, skip, take } = pageOptionsDto;
    const query: PaginationQuery<T> = {
      skip,
      take,
    };

    if (sortBy && !sortableKeys.includes(sortBy)) {
      throw new BadRequestException(`Invalid sort by, available: ${sortableKeys.join(', ')}`);
    } else {
      query.orderBy = { [sortBy]: sortOrder } as Record<keyof T, 'asc' | 'desc'>;
    }

    return query;
  }
}
