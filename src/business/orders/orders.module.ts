import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from '@/business/orders/orders.repository';
import { CartModule } from '@/business/cart/cart.module';

@Module({
  imports: [CartModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
