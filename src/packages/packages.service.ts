import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { FindPackagesDto } from './dto/find-packages.dto';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePackageDto) {
    const newPackage =  await this.prisma.packages.create({ data });
    return {
      data: {
        message: 'Pacote criado com sucesso',
        newPackage,
      },
      errorMessages: [],
    };
  }

  async findAll(filters?: FindPackagesDto) {
    const where: any = {};

    if (filters?.start_date && filters?.end_date) {
      const startDate = new Date(filters.start_date);
      const endDate = new Date(filters.end_date);
      
      startDate.setHours(startDate.getHours() + 3);
      endDate.setHours(endDate.getHours() + 3);
      
      const daysOfWeek = this.getDaysOfWeekBetweenDates(startDate, endDate);
      const weekDayNames = daysOfWeek.map(day => this.getWeekDayName(day));

      where.driver = {
        OR: weekDayNames.map(day => ({
          operation_hours: {
            array_contains: [{ week_day: day }]
          }
        }))
      };
    }

    const packages = await this.prisma.packages.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            operation_hours: true,
            users: {
              select: {
                full_name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        origin_point: true,
        destination_point: true
      },
    });

    return {
      data: {
        message: 'Pacotes encontrados com sucesso',
        packages,
      },
      errorMessages: [],
    };
  }

  async findOne(id: number) {
    const getPackage = await this.prisma.packages.findUnique({ where: { id } });
    return {
      data: {
        message: 'Pacote encontrado com sucesso',
        getPackage,
      },
      errorMessages: [],
    };
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const updatedPackage = await this.prisma.packages.update({ where: { id }, data: updatePackageDto });
    return {
      data: {
        message: 'Pacote atualizado com sucesso',
        updatedPackage,
      },
      errorMessages: [],
    };
  }

  async remove(id: number) {
    const deletedPackage = await this.prisma.packages.delete({ where: { id } });
    return {
      data: {
        message: 'Pacote deletado com sucesso',
        deletedPackage,
      }, 
      errorMessages: [],
    };
  }

  private getDaysOfWeekBetweenDates(startDate: Date, endDate: Date): number[] {
    const daysOfWeek: number[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const day = currentDate.getDay();
      daysOfWeek.push(day);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return [...new Set(daysOfWeek)];
  }

  private getWeekDayName(dayNumber: number): string {
    const weekDays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ];
    return weekDays[dayNumber];
  }
}
