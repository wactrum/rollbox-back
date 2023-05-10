import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@/auth/permission.service';
import { PERMISSIONS_KEY } from '@/auth/decorators/rbac.decorator';
import { UsersService } from '@/users/users.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { cacheWrapper } from '@/utils/cache';

@Injectable()
/**
 * Guard for check auth user permissions
 * with @Permission(Permissions.EXAMPLE_ACTION)
 */
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userPermissions = await this.getUserPermissions(user.id);
    return requiredPermissions.some((permission) => userPermissions.includes(permission));
  }

  /**
   * Use the cache so as not to go to the database with each request
   */
  async getUserPermissions(userId: number): Promise<string[]> {
    return cacheWrapper(this.cacheManager, 'permissions', userId, () =>
      this.userService.getAllPermissions(userId)
    );
  }
}
