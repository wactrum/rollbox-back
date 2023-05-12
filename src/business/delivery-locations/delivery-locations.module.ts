import { Module } from '@nestjs/common';
import { DeliveryLocationsService } from './delivery-locations.service';
import { DeliveryLocationsController } from './delivery-locations.controller';
import { DeliveryLocationsRepository } from '@/business/delivery-locations/delivery-locations.repository';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryLocationsController],
  providers: [DeliveryLocationsService, DeliveryLocationsRepository],
  exports: [DeliveryLocationsService],
})
export class DeliveryLocationsModule {}
