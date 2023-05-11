import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@/auth/permission.service';
import { PERMISSIONS_KEY } from '@/auth/decorators/rbac.decorator';
import { UsersService } from '@/users/users.service';
import { CacheService } from '@/cache/cache.service';
import { CacheTypes } from '@/cache/cache.dto';

@Injectable()
/**
 * Guard for check auth user permissions
 * with @Permission(Permissions.EXAMPLE_ACTION)
 */
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
    private cacheService: CacheService
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
    console.warn(userPermissions);
    return requiredPermissions.some((permission) => userPermissions.includes(permission));
  }

  /**
   * Use the cache so as not to go to the database with each request
   */
  async getUserPermissions(userId: number): Promise<string[]> {
    return this.cacheService.getOrCache(CacheTypes.PERMISSIONS, userId, () =>
      this.userService.getAllPermissions(userId)
    );
  }
}
