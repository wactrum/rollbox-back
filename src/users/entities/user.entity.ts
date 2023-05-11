import { Role, User } from '@prisma/client';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '@/roles/entities/role.entity';

export class UserEntity implements User {
  id: number;
  name: string | null;
  email: string;
  createdAt: Date;

  @ApiProperty({
    type: RoleEntity,
    isArray: true,
  })
  roles: Role[];
  phone: string;

  @ApiHideProperty()
  password: string;

  @ApiHideProperty()
  refreshToken: string | null;

  @ApiHideProperty()
  isEmailConfirmed: boolean;
}
