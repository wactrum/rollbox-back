import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '@/business/users/users.service';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { DeliveryLocationsService } from '@/business/delivery-locations/delivery-locations.service';
import { IsOwnerGuard } from '@/business/auth/guards/abstract.owner.guard';

@Injectable()
/**
 * Guard for check auth user permissions or user author delivery
 * with @DeliveryOwnerGuard(Permissions.EXAMPLE_ACTION)
 */
export class DeliveryOwnerGuard extends IsOwnerGuard {
  constructor(
    protected reflector: Reflector,
    protected userService: UsersService,
    protected cacheService: CacheService,
    private deliveryService: DeliveryLocationsService
  ) {
    super(reflector, userService, cacheService);
  }

  checkIsOwner(userId: number, paramId: number): Promise<boolean> {
    return this.deliveryService.checkIsAuthor(userId, paramId);
  }
}
