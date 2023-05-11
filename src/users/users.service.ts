import { Injectable } from '@nestjs/common';
import {
  AttachRoleDto,
  CreatePhoneConfirmationDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/user.dto';
import { PrismaService } from 'nestjs-prisma';
import * as argon2 from 'argon2';

export const select = {
  id: true,
  phone: true,
  email: true,
  name: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.phone = createUserDto.phone.replace('+', '');

    createUserDto.password = await argon2.hash(createUserDto.password);
    return this.prisma.user.create({
      data: createUserDto,
      select,
    });
  }

  async createPhoneConfirmation(createPhoneConformationDto: CreatePhoneConfirmationDto) {
    return this.prisma.phoneConfirmation.create({
      data: createPhoneConformationDto,
    });
  }

  setRefreshToken(id: number, token: string) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken: token },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ select });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { ...select, isEmailConfirmed: true },
    });
  }

  findRefreshById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        refreshToken: true,
        email: true,
        id: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { permissions: true } } },
    });
  }

  markEmailAsConfirmed(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: {
        isEmailConfirmed: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await argon2.hash(updateUserDto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select,
    });
  }

  async getAllPermissions(id: number): Promise<string[]> {
    const data = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const permissions: string[] = [];

    for (const role of data.roles) {
      permissions.push(...role.permissions.map((el) => el.name));
    }

    return [...new Set(permissions)];
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  setRoles(id: number, attachRoleDto: AttachRoleDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        roles: attachRoleDto.roles.length
          ? { connect: attachRoleDto.roles.map((el) => ({ id: el })) }
          : { set: [] },
      },
      select,
    });
  }
}
