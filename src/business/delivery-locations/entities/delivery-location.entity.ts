import { DeliveryLocation as Location } from '@prisma/client';
import { ApiHideProperty } from '@nestjs/swagger';

export class DeliveryLocationEntity implements Location {
  address: string;
  apartment: string | null;
  comment: string;
  floor: string | null;
  id: number;
  isPrivateHouse: boolean;
  porch: string | null;

  @ApiHideProperty()
  userId: number;
}
