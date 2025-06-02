import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOperationHourDto } from './dto/create-operation-hour.dto';
import { UpdateOperationHourDto } from './dto/update-operation-hour.dto';

@Injectable()
export class OperationHoursService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateOperationHourDto) {
    const driver = await this.prisma.drivers.update({
      where: { id: data.driver_id },
      data: {
        operation_hours: JSON.parse(JSON.stringify(data.operation_hours))
      },
    });

    return {
      data: {
        message: 'Horários de operação criados com sucesso',
        driver,
      },
      errorMessages: [],
    };
  }

  async findOne(driverId: number) {
    const driver = await this.prisma.drivers.findUnique({
      where: { id: driverId },
      select: {
        id: true,
        operation_hours: true,
      },
    });

    if (!driver) {
      return {
        data: null,
        errorMessages: ['Motorista não encontrado'],
      };
    }

    return {
      data: {
        driver_id: driver.id,
        operation_hours: driver.operation_hours,
      },
      errorMessages: [],
    };
  }

  async update(driverId: number, updateOperationHourDto: UpdateOperationHourDto) {
    const driver = await this.prisma.drivers.update({
      where: { id: driverId },
      data: {
        operation_hours: JSON.parse(JSON.stringify(updateOperationHourDto.operation_hours))
      },
    });

    return {
      data: {
        message: 'Horários de operação atualizados com sucesso',
        driver,
      },
      errorMessages: [],
    };
  }
}