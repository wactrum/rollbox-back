import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'nestjs-prisma';
import { findUniqueWithException } from '@/utils/prisma';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { CacheTypes } from '@/infrastructure/cache/cache.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService, private cacheService: CacheService) {}

  create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        permissions: {
          connect: createRoleDto.permissions.map((el) => ({
            id: el,
          })),
        },
      },
      include: {
        permissions: true,
      },
    });
  }

  findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: true,
      },
    });
  }

  async findOne(id: number) {
    return findUniqueWithException(this.prisma.role, {
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const updateRolePromise = this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name: updateRoleDto.name,
        permissions: {
          set: updateRoleDto.permissions.map((el) => ({
            id: el,
          })),
        },
      },
    });

    const resetRolesCachePromise = this.cacheService.resetCacheWithoutKey(CacheTypes.PERMISSIONS);

    const [roles] = await Promise.all([updateRolePromise, resetRolesCachePromise]);
    return roles;
  }

  remove(id: number) {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  getPermissions() {
    return this.prisma.permission.findMany();
  }
}
