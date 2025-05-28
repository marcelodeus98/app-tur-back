import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDto) {
    return this.prisma.role.create({ data });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(id: number) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }
}
