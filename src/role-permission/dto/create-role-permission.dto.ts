import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolePermissionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  roleId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  permissionId: number;
}
