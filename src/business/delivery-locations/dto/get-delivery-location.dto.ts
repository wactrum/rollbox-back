import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { CastToBoolean } from '@/utils/transform/bool.transform';
import { FullTextSearch } from '@/utils/transform/string.transform';

export class DeliveryLocationSearchDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  @FullTextSearch()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  @CastToBoolean()
  isPrivateHouse?: boolean;
}
