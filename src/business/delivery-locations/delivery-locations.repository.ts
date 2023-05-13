import { Injectable } from '@nestjs/common';
import { CreateDeliveryLocationDto } from './dto/create-delivery-location.dto';
import { UpdateDeliveryLocationDto } from './dto/update-delivery-location.dto';
import { PrismaService } from 'nestjs-prisma';
import { DeliveryLocationSearchDto } from '@/business/delivery-locations/dto/get-delivery-location.dto';

@Injectable()
export class DeliveryLocationsRepository {
  constructor(private prismaService: PrismaService) {}

  create(createDeliveryLocationDto: CreateDeliveryLocationDto) {
    return this.prismaService.deliveryLocation.create({
      data: createDeliveryLocationDto,
    });
  }

  findAll(query: DeliveryLocationSearchDto) {
    return this.prismaService.deliveryLocation.findMany({
      where: { isPrivateHouse: query.isPrivateHouse, address: { search: query.search } },
    });
  }

  findByUser(id: number, que: DeliveryLocationSearchDto) {
    return this.prismaService.deliveryLocation.findMany({
      where: { userId: id, isPrivateHouse: que.isPrivateHouse, address: { search: que.search } },
    });
  }

  async checkIsAuthor(id: number, userId: number) {
    const data = await this.prismaService.deliveryLocation.findFirst({
      where: { id, userId },
    });
    return !!data;
  }

  findOne(id: number) {
    return this.prismaService.deliveryLocation.findUnique({
      where: { id },
    });
  }

  update(id: number, updateDeliveryLocationDto: UpdateDeliveryLocationDto) {
    return this.prismaService.deliveryLocation.update({
      where: { id },
      data: updateDeliveryLocationDto,
    });
  }

  remove(id: number) {
    return this.prismaService.deliveryLocation.delete({
      where: { id },
    });
  }
}
