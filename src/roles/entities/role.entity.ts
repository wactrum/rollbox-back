import { Role as PrismaRole, Permission } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class PermissionEntity implements Permission {
  id: number;
  name: string;
}

export class RoleEntity implements PrismaRole {
  id: number;
  name: string;

  @ApiProperty({
    type: PermissionEntity,
    isArray: true,
  })
  permissions?: Permission[]
}

