import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AttachRoleDto } from './dto/user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { Permission } from '@/business/auth/permission.service';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions(Permission.CREATE_USER)
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions(Permission.VIEW_USERS)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions(Permission.VIEW_USER)
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Permissions(Permission.USER_UPDATE)
  @ApiOkResponse({ type: UserEntity })
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Permissions(Permission.USER_DELETE)
  remove(@Param('id', ParseIntPipe) id: string) {
    this.usersService.remove(+id);
  }

  /**
   * Установить роли пользователю
   */
  @Patch('/:id/set-roles')
  @Permissions(Permission.EDIT_USER_ROLES)
  @ApiCreatedResponse({ type: UserEntity })
  async setRoles(@Param('id', ParseIntPipe) id: string, @Body() attachRoleDto: AttachRoleDto) {
    return this.usersService.setRoles(+id, attachRoleDto);
  }

  @Get('/me')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserEntity })
  me(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }
}
