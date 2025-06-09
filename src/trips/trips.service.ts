import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateTripDto) {
    console.log(data);

    // 1. Validações iniciais
    const getPackage = await this.prisma.packages.findUnique({
      where: { id: data.package_id },
      include: {
        vehicle: true,
        driver: { select: { userId: true } }
      }
    });

    console.log('getPackage', getPackage);

    if (!getPackage?.vehicle) {
      return {
        data: null,
        errorMessages: ['Pacote ou veículo não encontrado'],
      };
    }

    const receivedDate = new Date(data.schedule_date);
    console.log('Data recebida:', receivedDate.toString());
    console.log('Horas locais:', receivedDate.getHours(), 'Minutos:', receivedDate.getMinutes());

    const brasiliaDate = new Date(
      Date.UTC(
        receivedDate.getFullYear(),
        receivedDate.getMonth(),
        receivedDate.getDate(),
        receivedDate.getHours(),
        receivedDate.getMinutes(),
        0,
        0
      )
    );

    brasiliaDate.setHours(brasiliaDate.getHours() - 3);

    const availability = await this.checkAvailability(
      data.package_id,
      receivedDate,
      data.quantity_seats
    );

    if (!availability.available) {
      return {
        data: null,
        errorMessages: [availability.reason || 'Não há vagas disponíveis'],
      };
    }

    const totalAmount = getPackage.amount * data.quantity_seats;

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const client = await prisma.users.findUnique({
          where: { id: data.client_id },
          select: { walletId: true }
        });

        console.log('client', client);

        if (!client?.walletId) {
          throw new Error('Cliente não possui carteira cadastrada');
        }

        // 6. Criar pagamento
        const payment = await prisma.payments.create({
          data: {
            amount: totalAmount,
            status: 'PENDING',
            observation: `Reserva para ${data.quantity_seats} pessoas`,
            payment_types_id: data.payment_types_id,
            client_id: data.client_id,
          }
        });

        console.log('payment', payment);

        // 7. Criar reserva - CONVERTENDO PARA UTC ANTES DE SALVAR
        const trip = await prisma.trips.create({
          data: {
            client_id: data.client_id,
            driver_id: getPackage.driver_id,
            package_id: data.package_id,
            status: 'PENDING',
            payment_id: payment.id,
            seats_booked: data.quantity_seats,
            // Convertemos para UTC antes de salvar
            schedule_date: new Date(brasiliaDate.getTime() + (3 * 60 * 60000)), // +3 horas para UTC
          }
        });

        console.log('Data armazenada no banco:', trip.schedule_date);

        // 8. Atualizar carteira do cliente
        await prisma.walletHistory.create({
          data: {
            type: 'CREDIT',
            amount: totalAmount,
            wallet_id: client.walletId,
            trip_id: trip.id,
            observation: 'Reserva pendente de confirmação'
          }
        });

        await prisma.wallet.update({
          where: { id: client.walletId },
          data: { balance: { increment: totalAmount } }
        });

        return { trip, payment };
      });

      return {
        data: result,
        errorMessages: [],
      };
    } catch (error) {
      return {
        data: null,
        errorMessages: [error.message],
      };
    }
  }

  findAll() {
    return `This action returns all trips`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }

  private async checkAvailability(packageId: number, date: Date, seats: number) {
    const tripDate = new Date(date);
    const localHours = tripDate.getHours();
    const localMinutes = tripDate.getMinutes();

    const pkg = await this.prisma.packages.findUnique({
      where: { id: packageId },
      include: {
        vehicle: { select: { number_seats: true } },
        trips: {
          where: {
            schedule_date: {
              gte: new Date(tripDate.setHours(0, 0, 0, 0)),
              lt: new Date(tripDate.setHours(23, 59, 59, 999))
            },
            status: { not: 'REJECTED' }
          }
        },
        driver: {
          select: {
            operation_hours: true
          }
        }
      }
    });

    if (!pkg || !pkg.vehicle || !pkg.driver) {
      return { available: false, reason: 'Pacote ou veículo não encontrado' };
    }

    const operationHours = pkg.driver.operation_hours as unknown as Array<{
      week_day: string;
      start_time: string;
      end_time: string;
      break_start?: string;
      break_end?: string;
    }>;

    if (!operationHours || !Array.isArray(operationHours)) {
      throw new BadRequestException({
        data: null,
        errorMessages: ['Horários de operação do motorista não configurados'],
      });
    }

    const dayOfWeek = this.getWeekDayName(tripDate.getDay());
    const dayOperation = operationHours.find(oh => oh.week_day.toLowerCase() === dayOfWeek.toLowerCase());

    if (!dayOperation) {
      throw new BadRequestException({
        data: null,
        errorMessages: ['Motorista não opera neste dia'],
      })
    }

    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const tripStartMinutes = localHours * 60 + localMinutes;
    const dayStart = timeToMinutes(dayOperation.start_time);
    const dayEnd = timeToMinutes(dayOperation.end_time);

    if (tripStartMinutes < dayStart || tripStartMinutes >= dayEnd) {
      return {
        available: false,
        reason: `Fora do horário de operação (${dayOperation.start_time} às ${dayOperation.end_time})`
      };
    }

    if (dayOperation.break_start && dayOperation.break_end) {
      const breakStart = timeToMinutes(dayOperation.break_start);
      const breakEnd = timeToMinutes(dayOperation.break_end);

      if (tripStartMinutes >= breakStart && tripStartMinutes < breakEnd) {
        throw new BadRequestException({
          data: null,
          errorMessages: ['Fora do horário de operação (intervalo de pausa)'],
        });
      }
    }

    const totalSeatsBooked = pkg.trips.reduce((sum, trip) => {
      return sum + (trip.seats_booked || 0);
    }, 0);

    const availableSeats = pkg.vehicle.number_seats! - totalSeatsBooked;
    return {
      available: availableSeats >= seats,
      availableSeats,
      requestedSeats: seats,
      reason: availableSeats >= seats ? undefined : `Apenas ${availableSeats} assentos disponíveis`
    };
  }

  private getWeekDayName(dayNumber: number): string {
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return weekDays[dayNumber];
  }
}
