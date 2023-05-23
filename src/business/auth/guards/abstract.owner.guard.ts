import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@/business/auth/permission.service';
import { UsersService } from '@/business/users/users.service';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { PERMISSIONS_KEY } from '@/business/auth/decorators/rbac.decorator';
import { RbacGuard } from '@/business/auth/guards/rbac.guard';

export abstract class IsOwnerGuard extends RbacGuard {
  protected constructor(
    protected reflector: Reflector,
    protected userService: UsersService,
    protected cacheService: CacheService
  ) {
    super(reflector, userService, cacheService);
  }

  protected getContext(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const params = request.params;
    const paramId = params.id;

    return {
      user,
      paramId,
    };
  }

  abstract checkIsOwner(userId: number, paramId: number): Promise<boolean>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user, paramId } = this.getContext(context);
    const userPermissions = await this.getUserPermissions(user.id);

    const hasPermissions = requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );

    if (hasPermissions) {
      return true;
    }

    const isOwner = await this.checkIsOwner(+user.id, +paramId);

    if (!requiredPermissions) {
      return isOwner;
    }

    return isOwner || hasPermissions;
  }
}
