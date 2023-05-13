import {
  Request,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { DeliveryLocationsService } from './delivery-locations.service';
import { CreateDeliveryLocationDto } from './dto/create-delivery-location.dto';
import { UpdateDeliveryLocationDto } from './dto/update-delivery-location.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';
import { Permission } from '@/business/auth/permission.service';
import { DeliveryOwnerGuard } from '@/business/delivery-locations/guard/owner.guard';
import { DeliveryLocationSearchDto } from '@/business/delivery-locations/dto/get-delivery-location.dto';
import { DeliveryLocationEntity } from '@/business/delivery-locations/entities/delivery-location.entity';

@ApiTags('delivery-locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('delivery-locations')
export class DeliveryLocationsController {
  constructor(private readonly deliveryLocationsService: DeliveryLocationsService) {}

  @Post()
  @ApiCreatedResponse({ type: DeliveryLocationEntity })
  create(@Req() req, @Body() createDeliveryLocationDto: CreateDeliveryLocationDto) {
    return this.deliveryLocationsService.create({
      ...createDeliveryLocationDto,
      userId: req.user.id,
    });
  }

  @Get()
  @UseGuards(RbacGuard)
  @Permissions(Permission.VIEW_DELIVERY_LOCATIONS)
  @ApiOkResponse({ type: DeliveryLocationEntity, isArray: true })
  findAll(@Query() query: DeliveryLocationSearchDto) {
    return this.deliveryLocationsService.findAll(query);
  }

  @Get('my')
  @ApiOkResponse({ type: DeliveryLocationEntity, isArray: true })
  findMy(@Request() req, @Query() query: DeliveryLocationSearchDto) {
    return this.deliveryLocationsService.findByUser(req.user.id, query);
  }

  @Get(':id')
  @UseGuards(DeliveryOwnerGuard)
  @Permissions(Permission.VIEW_DELIVERY_LOCATION)
  @ApiOkResponse({ type: DeliveryLocationEntity })
  findOne(@Param('id') id: string) {
    return this.deliveryLocationsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(DeliveryOwnerGuard)
  @Permissions(Permission.UPDATE_DELIVERY_LOCATIONS)
  @ApiOkResponse({ type: DeliveryLocationEntity })
  update(@Param('id') id: string, @Body() updateDeliveryLocationDto: UpdateDeliveryLocationDto) {
    return this.deliveryLocationsService.update(+id, updateDeliveryLocationDto);
  }

  @Delete(':id')
  @UseGuards(DeliveryOwnerGuard)
  @Permissions(Permission.DELETE_DELIVERY_LOCATIONS)
  remove(@Param('id') id: string) {
    return this.deliveryLocationsService.remove(+id);
  }
}
