import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PermissionEntity, RoleEntity } from '@/business/roles/entities/role.entity';
import { JwtAuthGuard } from '@/business/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';
import { Permission } from '@/business/auth/permission.service';
import { Permissions } from '@/business/auth/decorators/rbac.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(Permission.CREATE_ROLE)
  @ApiOkResponse({ type: RoleEntity })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions(Permission.VIEW_ROLES)
  @ApiOkResponse({ type: RoleEntity, isArray: true })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions(Permission.VIEW_ROLE)
  @ApiOkResponse({ type: RoleEntity })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @Permissions(Permission.UPDATE_ROLE)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions(Permission.DELETE_ROLE)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  /**
   * Список доступов системы
   */
  @Get('/permissions')
  @Permissions(Permission.VIEW_ROLES, Permission.CREATE_ROLE, Permission.UPDATE_ROLE)
  @ApiOkResponse({ type: PermissionEntity, isArray: true })
  getPermissions() {
    return this.rolesService.getPermissions();
  }
}
