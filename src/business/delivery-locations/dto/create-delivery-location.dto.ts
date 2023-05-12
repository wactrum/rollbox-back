import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateDeliveryLocationDto {
  @IsNotEmpty()
  address: string;

  @IsBoolean()
  isPrivateHouse: boolean;

  apartment?: string | null;
  comment?: string | null;
  floor?: string | null;
  porch?: string | null;

  @ApiHideProperty()
  userId: number;
}
