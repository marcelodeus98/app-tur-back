import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDto) {
    return this.prisma.roles.create({ data });
  }

  async findAll() {
    return this.prisma.roles.findMany();
  }

  async findOne(id: number) {
    return this.prisma.roles.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return this.prisma.roles.delete({ where: { id } });
  }
}
