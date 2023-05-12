import { Injectable } from '@nestjs/common';
import { CreateDeliveryLocationDto } from './dto/create-delivery-location.dto';
import { UpdateDeliveryLocationDto } from './dto/update-delivery-location.dto';
import { DeliveryLocationsRepository } from '@/business/delivery-locations/delivery-locations.repository';
import { DeliveryLocationSearchDto } from '@/business/delivery-locations/dto/get-delivery-location.dto';

@Injectable()
export class DeliveryLocationsService {
  constructor(private deliveryLocationsRepository: DeliveryLocationsRepository) {}

  create(createDeliveryLocationDto: CreateDeliveryLocationDto) {
    return this.deliveryLocationsRepository.create(createDeliveryLocationDto);
  }

  findAll() {
    return this.deliveryLocationsRepository.findAll();
  }

  checkIsAuthor(userId: number, id: number) {
    return this.deliveryLocationsRepository.checkIsAuthor(id, userId);
  }

  findByUser(id: number, que: DeliveryLocationSearchDto) {
    return this.deliveryLocationsRepository.findByUser(id, que);
  }

  findOne(id: number) {
    return this.deliveryLocationsRepository.findOne(id);
  }

  update(id: number, updateDeliveryLocationDto: UpdateDeliveryLocationDto) {
    return this.deliveryLocationsRepository.update(id, updateDeliveryLocationDto);
  }

  remove(id: number) {
    return this.deliveryLocationsRepository.remove(id);
  }
}
