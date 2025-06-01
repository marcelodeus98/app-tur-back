import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePointDto) {
    const point = await this.prisma.points.create({ data });
    return {
      data: point,
      errorMessages: [],
    };
  }

  async findAll() {
    const points = await this.prisma.points.findMany();
    return {
      data: points,
      errorMessages: [],
    };
  }

  async findOne(id: number) {
    const point = await this.prisma.points.findUnique({ where: { id } });
    return {
      data: point,
      errorMessages: [],
    };
  }

  async update(id: number, data: UpdatePointDto) {
    const point = await this.prisma.points.update({ where: { id }, data });
    return {
      data: point,
      errorMessages: [],
    };
  }

  async remove(id: number) {
    const point = await this.prisma.points.delete({ where: { id } });
    return {
      data: point,
      errorMessages: [],
    };
  }
}
