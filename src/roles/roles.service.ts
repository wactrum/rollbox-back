import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from "nestjs-prisma";
import { findUniqueWithException } from '@/utils/prisma';

@Injectable()
export class RolesService {
  constructor(
      private prisma: PrismaService
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        permissions: {
          connect: createRoleDto.permissions.map(el => ({
              id: el
          }))
        }
      },
      include: {
        permissions: true
      }
    })
  }

  findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: true
      }
    });
  }

  async findOne(id: number) {
    return findUniqueWithException(this.prisma.role, {
      where: {
        id
      },
      include: {
        permissions: true
      }
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prisma.role.update({
      where: {
        id
      },
      data: {
        name: updateRoleDto.name,
        permissions: {
          connect: updateRoleDto?.permissions.map(el => ({
            id: el
          }))
        }
      }
    });
  }

  remove(id: number) {
    return this.prisma.role.delete({
      where: {id}
    });
  }

  getPermissions() {
    return this.prisma.permission.findMany()
  }
}
