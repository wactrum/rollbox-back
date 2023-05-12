import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { BadRequestResponseDto } from '@/utils/decorators/api/dto';

export function ApiDefaultBadRequestResponse() {
  return applyDecorators(ApiBadRequestResponse({ type: BadRequestResponseDto }));
}
