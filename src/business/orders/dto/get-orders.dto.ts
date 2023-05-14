import { PaginationQueryDto } from '@/infrastructure/database/prisma/dto/pagination.dto';
import { OrderStatuses, OrderType, PaymentTypes } from '@prisma/client';
import { IsDate, IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateGreaterThan } from '@/utils/validators/date.validators';
import { Type } from 'class-transformer';

export class GetOrdersDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @IsEnum(OrderStatuses)
  @ApiProperty({ enum: OrderStatuses, required: false })
  status?: OrderStatuses;

  @IsOptional()
  @IsEnum(OrderType)
  @ApiProperty({ enum: OrderType, required: false })
  type?: OrderType;

  @IsOptional()
  @IsEnum(PaymentTypes)
  @ApiProperty({ enum: PaymentTypes, required: false })
  paymentType?: PaymentTypes;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAtFrom?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Validate(IsDateGreaterThan, ['createdAtFrom'])
  createdAtTo?: Date;
}
