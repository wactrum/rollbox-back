import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '@/business/users/users.service';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { IsOwnerGuard } from '@/business/auth/guards/abstract.owner.guard';
import { OrdersService } from '@/business/orders/orders.service';

@Injectable()
/**
 * Guard for check auth user permissions or user author order
 * with @OrderOwnerGuard(Permissions.EXAMPLE_ACTION)
 */
export class OrderOwnerGuard extends IsOwnerGuard {
  constructor(
    protected reflector: Reflector,
    protected userService: UsersService,
    protected cacheService: CacheService,
    private ordersService: OrdersService
  ) {
    super(reflector, userService, cacheService);
  }

  checkIsOwner(userId: number, paramId: number): Promise<boolean> {
    return this.ordersService.checkIsAuthor(userId, paramId);
  }
}
