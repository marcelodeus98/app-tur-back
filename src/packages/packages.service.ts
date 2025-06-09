import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { FindPackagesDto } from './dto/find-packages.dto';


interface OperationHour {
  week_day: string;
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
}

export interface AvailableSlot {
  hour: string;
  availableSeats: number;
  totalSeats: number | null;
  isBreakSlot: boolean;
  description?: string;
}

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePackageDto) {
    const newPackage = await this.prisma.packages.create({ data });
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
    const getPackage = await this.prisma.packages.findUnique({
      where: { id },
      select: {
        id: true,
        origin_point: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        starting_point: true,
        stops: true,
        destination_point: {
          select: {
            id: true,
            name: true
          }
        },
        driver: {
          select: {
            id: true,
            users: {
              select: {
                full_name: true,
              }
            }
          }
        },
        vehicle: {
          select: {
            id: true,
            model: true,
            brand: true,
            color: true,
            number_seats: true
          }
        }
      }
    });

    return {
      data: {
        message: 'Pacote encontrado com sucesso',
        getPackage,
      },
      errorMessages: [],
    };
  }

  async getAvailableSlots(packageId: number, date: Date) {
    try {
      const pkg = await this.prisma.packages.findUnique({
        where: { id: packageId },
        include: {
          vehicle: { select: { number_seats: true } },
          trips: {
            where: {
              schedule_date: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999))
              },
              status: { not: 'REJECTED' }
            },
            include: {
              package: {
                select: {
                  duration: true
                }
              }
            }
          },
          driver: { select: { operation_hours: true } }
        }
      });

      if (!pkg || !pkg.vehicle || !pkg.driver) {
        throw new NotFoundException('Pacote não encontrado ou informações incompletas');
      }

      const operationHours = pkg.driver.operation_hours as unknown as Array<{
        week_day: string;
        start_time: string;
        end_time: string;
        break_start?: string;
        break_end?: string;
      }>;

      if (!operationHours || !Array.isArray(operationHours)) {
        throw new BadRequestException('Horários de operação não configurados para este motorista');
      }

      const dayOfWeek = this.getWeekDayName(date.getDay());
      const dayOperationHours = operationHours.find(oh => oh.week_day === dayOfWeek);

      if (!dayOperationHours) {
        return {
          data: {
            message: 'Nenhum horário de operação para este dia',
            slots: []
          },
          errorMessages: []
        };
      }

      const timeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const startMinutes = timeToMinutes(dayOperationHours.start_time);
      const endMinutes = timeToMinutes(dayOperationHours.end_time);
      const breakStartMinutes = dayOperationHours.break_start ? timeToMinutes(dayOperationHours.break_start) : null;
      const breakEndMinutes = dayOperationHours.break_end ? timeToMinutes(dayOperationHours.break_end) : null;

      const slots: AvailableSlot[] = [];
      const timeSlotDuration = 60; // 1 hora entre os slots

      // Criar array de horários ocupados considerando a duração
      const occupiedSlots: { start: number, end: number }[] = [];

      pkg.trips.forEach(trip => {
        const tripDate = new Date(trip.schedule_date);
        const tripStartMinutes = tripDate.getHours() * 60 + tripDate.getMinutes();
        const tripDurationMinutes = trip.package.duration * 60;
        const tripEndMinutes = tripStartMinutes + tripDurationMinutes;

        occupiedSlots.push({
          start: tripStartMinutes,
          end: tripEndMinutes
        });
      });

      for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += timeSlotDuration) {
        // Verificar se está no horário de pausa
        if (breakStartMinutes && breakEndMinutes &&
          currentMinutes >= breakStartMinutes &&
          currentMinutes < breakEndMinutes) {
          currentMinutes = breakEndMinutes - timeSlotDuration;
          continue;
        }

        // Verificar se o slot está ocupado por alguma viagem existente
        const slotEndMinutes = currentMinutes + timeSlotDuration;
        const isSlotOccupied = occupiedSlots.some(occupied =>
          (currentMinutes >= occupied.start && currentMinutes < occupied.end) ||
          (slotEndMinutes > occupied.start && slotEndMinutes <= occupied.end) ||
          (currentMinutes <= occupied.start && slotEndMinutes >= occupied.end)
        );

        if (isSlotOccupied) {
          continue;
        }

        // Verificar disponibilidade de assentos para este horário
        const hour = Math.floor(currentMinutes / 60);
        const tripsAtHour = pkg.trips.filter(t => {
          const tripDate = new Date(t.schedule_date);
          const tripStartMinutes = tripDate.getHours() * 60 + tripDate.getMinutes();
          const tripDurationMinutes = t.package.duration * 60;
          const tripEndMinutes = tripStartMinutes + tripDurationMinutes;

          // Verifica se há sobreposição de horários
          return (currentMinutes >= tripStartMinutes && currentMinutes < tripEndMinutes) ||
            (slotEndMinutes > tripStartMinutes && slotEndMinutes <= tripEndMinutes) ||
            (currentMinutes <= tripStartMinutes && slotEndMinutes >= tripEndMinutes);
        });

        const bookedSeats = tripsAtHour.reduce((sum, trip) => sum + (trip.seats_booked || 0), 0);
        const availableSeats = pkg.vehicle.number_seats! - bookedSeats;

        if (availableSeats > 0) {
          slots.push({
            hour: `${Math.floor(currentMinutes / 60).toString().padStart(2, '0')}:${(currentMinutes % 60).toString().padStart(2, '0')}`,
            availableSeats,
            totalSeats: pkg.vehicle.number_seats,
            isBreakSlot: false
          });
        }
      }

      // Adicionar slot de pausa se existir
      if (breakStartMinutes && breakEndMinutes) {
        const breakStartHour = Math.floor(breakStartMinutes / 60);
        const breakStartMin = breakStartMinutes % 60;
        const breakEndHour = Math.floor(breakEndMinutes / 60);
        const breakEndMin = breakEndMinutes % 60;

        slots.push({
          hour: `${breakStartHour.toString().padStart(2, '0')}:${breakStartMin.toString().padStart(2, '0')} - ${breakEndHour.toString().padStart(2, '0')}:${breakEndMin.toString().padStart(2, '0')}`,
          availableSeats: 0,
          totalSeats: 0,
          isBreakSlot: true,
          description: 'Horário de pausa do motorista'
        });
      }

      // Ordenar os slots
      slots.sort((a, b) => {
        if (a.isBreakSlot) return 1;
        if (b.isBreakSlot) return -1;
        return a.hour.localeCompare(b.hour);
      });

      return {
        data: {
          message: 'Horários disponíveis encontrados',
          slots
        },
        errorMessages: []
      };
    } catch (error) {
      return {
        data: null,
        errorMessages: [error.message || 'Erro desconhecido']
      };
    }
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

  private timeStringToHours(timeString: string): number {
    const [hours] = timeString.split(':').map(Number);
    return hours;
  }
}
