import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersDto, GetUserOrdersDto } from '@/business/orders/dto/get-orders.dto';
import { ApiPaginatedResponse } from '@/infrastructure/database/prisma/decorators/pagination.decorator';
import { OrderEntity, RetriveOrderEntity } from '@/business/orders/entities/order.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';
import { Permission } from '@/business/auth/permission.service';
import { OrderOwnerGuard } from '@/business/orders/guard/order-owner.guard';
import { CancelOrderDto } from '@/business/orders/dto/cancel-order.dto';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiCreatedResponse({ type: OrderEntity })
  create(@Request() request, @Body() createOrderDto: CreateOrderRequestDto) {
    return this.ordersService.createFromCart(request.user.cartId, createOrderDto);
  }

  @Get()
  @Permissions(Permission.VIEW_ORDERS)
  @ApiPaginatedResponse(OrderEntity)
  findAll(@Query() query: GetOrdersDto) {
    return this.ordersService.findAllWithPagination(query);
  }

  @Get('/my')
  @ApiPaginatedResponse(OrderEntity)
  findMy(@Request() request, @Query() query: GetUserOrdersDto) {
    return this.ordersService.findByUserWithPagination(request.user.id, query);
  }

  @Get(':id')
  @Permissions(Permission.VIEW_ORDER)
  @UseGuards(OrderOwnerGuard)
  @ApiOkResponse({ type: RetriveOrderEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrderEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

  @Post('/cancel')
  @UseGuards(OrderOwnerGuard)
  @Permissions(Permission.UPDATE_ORDER)
  cancel(@Param('id', ParseIntPipe) id: number, @Body() cancelOrderDto: CancelOrderDto) {
    return this.ordersService.cancel(id, cancelOrderDto);
  }
}
