import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { MailService } from '@/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfirmationService } from '@/auth/confirmation.service';
import { mockDeep } from 'jest-mock-extended';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService = mockDeep<UsersService>();
  let mockMailService = mockDeep<MailService>();
  let mockConfirmationService = mockDeep<ConfirmationService>();

  // @ts-ignore
  mockUserService.findByEmail.mockImplementation(async (email) => ({
    id: 1,
    email,
    name: 'Tester',
    password: await argon2.hash('secret'),
  }));

  // @ts-ignore
  mockUserService.create.mockImplementation(async (data) => ({
    id: 2,
    name: data.name,
    email: data.email,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AuthService,
        JwtService,
        { provide: UsersService, useValue: mockUserService },
        { provide: MailService, useValue: mockMailService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('base', () => {
    it('guard login', async () => {
      const dto = {
        email: 'test@gmail.com',
        password: 'secret',
      };

      const data = await service.validateUser(dto.email, dto.password);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(data.password).toBe(undefined);
      expect(data.id).toBe(1);
    });

    it('login', async () => {
      await service.login({
        id: 1,
        email: 'test@gmail.com',
      });

      expect(mockUserService.setRefreshToken).toHaveBeenCalled();
    });

    it('register', async () => {
      const dto = {
        email: 'test@gmail.com',
        password: 'secret',
        name: 'Test',
      };

      await service.register({ ...dto });

      expect(mockUserService.create).toHaveBeenCalled();
      expect(mockConfirmationService.sendVerificationLink).toHaveBeenCalledWith(
        dto.email,
        dto.name
      );
    });

    it('send reset password link', async () => {
      const dto = {
        email: 'test@gmail.com',
      };

      await service.sendResetPasswordLink(dto);
      expect(mockMailService.sendRestPasswordLink).toHaveBeenCalled();
    });
  });
});
