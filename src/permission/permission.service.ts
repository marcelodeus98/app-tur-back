import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePermissionDto) {
    return this.prisma.permission.create({ data });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: number) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return this.prisma.permission.delete({ where: { id } });
  }
}
