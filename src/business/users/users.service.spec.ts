import { Test, TestingModule } from '@nestjs/testing';
import { UsersService, select } from './users.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from 'nestjs-prisma';
import { PrismaClient } from '@prisma/client';

describe('RolesService', () => {
  let usersService: UsersService;
  let mockPrismaService: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('setRoles', () => {
    it('should update user roles with connect method if roles are provided', async () => {
      // Arrange
      const userId = 1;
      const roleId = 2;
      const attachRoleDto = { roles: [roleId] };

      // Act
      await usersService.setRoles(userId, attachRoleDto);

      // Assert
      // @ts-ignore
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          roles: { connect: [{ id: roleId }] },
        },
        select,
      });
    });

    it('should update user roles with set method if no roles are provided', async () => {
      // Arrange
      const userId = 1;
      const attachRoleDto = { roles: [] };

      // Act
      await usersService.setRoles(userId, attachRoleDto);

      // Assert
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          roles: { set: [] },
        },
        select,
      });
    });
  });
});
