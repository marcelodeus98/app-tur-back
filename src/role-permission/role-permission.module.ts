import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RolePermissionController],
  providers: [RolePermissionService, PrismaService],
})
export class RolePermissionModule {}
