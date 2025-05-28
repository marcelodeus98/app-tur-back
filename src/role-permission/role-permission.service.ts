import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRolePermissionDto) {
    return this.prisma.rolePermission.create({ data });
  }

  async findAll() {
    return this.prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.rolePermission.delete({ where: { id } });
  }
}
