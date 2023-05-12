import { Injectable } from '@nestjs/common';
import {
  AttachRoleDto,
  CreatePhoneConfirmationDto,
  CreateRefreshTokenDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/user.dto';
import { PrismaService } from 'nestjs-prisma';
import * as argon2 from 'argon2';
import { PhoneConfirmationType } from '@prisma/client';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { CacheTypes } from '@/infrastructure/cache/cache.dto';

export const select = {
  id: true,
  phone: true,
  email: true,
  name: true,
  createdAt: true,
  birthDate: true,
  gender: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private cacheService: CacheService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.phone = createUserDto.phone.replace('+', '');

    createUserDto.password = await argon2.hash(createUserDto.password);
    return this.prisma.user.create({
      data: createUserDto,
      select,
    });
  }

  getRefreshTokens(id: number) {
    return this.prisma.refreshToken.findMany({
      where: { userId: id },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  deleteRefreshToken(id: number) {
    return this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  addRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto) {
    const { userId, ...data } = createRefreshTokenDto;

    return this.prisma.refreshToken.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  updateRefreshToken(id: number, token: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { token },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ select });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { ...select, isEmailConfirmed: true, roles: { include: { permissions: true } } },
    });
  }

  findWithRefresh(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        refreshTokens: true,
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

  findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      include: { roles: { include: { permissions: true } } },
    });
  }

  findByPhoneWithPasswordConfirmation(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      include: {
        roles: { include: { permissions: true } },
        phoneConfirmation: {
          where: { type: PhoneConfirmationType.PASSWORD_RESET },
        },
      },
    });
  }

  async createOrUpdatePhoneConfirmation(createPhoneConformationDto: CreatePhoneConfirmationDto) {
    return this.prisma.phoneConfirmation.upsert({
      where: {
        userId_type: {
          userId: createPhoneConformationDto.userId,
          type: createPhoneConformationDto.type,
        },
      },
      update: {
        ...createPhoneConformationDto,
        isUsed: false,
        createdAt: new Date(),
      },
      create: createPhoneConformationDto,
    });
  }

  findConfirmedByPhone(phone: string) {
    return this.prisma.user.findFirst({
      where: { phone, isPhoneConfirmed: true },
      include: { roles: { include: { permissions: true } } },
    });
  }

  findPhoneConfirmation(phone: string, type: PhoneConfirmationType) {
    return this.prisma.phoneConfirmation.findFirst({
      where: {
        user: {
          phone,
          phoneConfirmation: {
            some: {
              type,
            },
          },
        },
      },
    });
  }

  async markPhoneAsConfirmed(phone: string) {
    const user = await this.prisma.user.update({
      where: { phone },
      data: {
        isPhoneConfirmed: true,
      },
      select,
    });

    await this.prisma.phoneConfirmation.update({
      where: {
        userId_type: {
          userId: user.id,
          type: PhoneConfirmationType.REGISTER,
        },
      },
      data: {
        isUsed: true,
      },
    });

    return user;
  }

  async findUnusedConfirmation(phone: string, code: string, type: PhoneConfirmationType) {
    return this.prisma.phoneConfirmation.findFirst({
      where: {
        user: {
          phone,
        },
        code,
        type,
        isUsed: false,
      },
    });
  }

  async markPasswordResetUsed(phoneConfirmationId: number) {
    return this.prisma.phoneConfirmation.update({
      where: {
        id: phoneConfirmationId,
      },
      data: {
        isUsed: true,
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

  async setRoles(id: number, attachRoleDto: AttachRoleDto) {
    const updatePromise = this.prisma.user.update({
      where: { id },
      data: {
        roles: attachRoleDto.roles.length
          ? { set: attachRoleDto.roles.map((el) => ({ id: el })) }
          : { set: [] },
      },
      select,
    });

    const clearCachePromise = this.cacheService.resetCache(CacheTypes.PERMISSIONS, id);

    const [user] = await Promise.all([updatePromise, clearCachePromise]);
    return user;
  }
}
