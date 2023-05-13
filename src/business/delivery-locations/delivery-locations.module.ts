import { Module } from '@nestjs/common';
import { DeliveryLocationsService } from './delivery-locations.service';
import { DeliveryLocationsController } from './delivery-locations.controller';
import { DeliveryLocationsRepository } from '@/business/delivery-locations/delivery-locations.repository';

@Module({
  controllers: [DeliveryLocationsController],
  providers: [DeliveryLocationsService, DeliveryLocationsRepository],
  exports: [DeliveryLocationsService],
})
export class DeliveryLocationsModule {}
