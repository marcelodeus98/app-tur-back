import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePermissionDto) {
    return this.prisma.permissions.create({ data });
  }

  async findAll() {
    return this.prisma.permissions.findMany();
  }

  async findOne(id: number) {
    return this.prisma.permissions.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return this.prisma.permissions.delete({ where: { id } });
  }
}
