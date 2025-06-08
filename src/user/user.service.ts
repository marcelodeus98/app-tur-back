import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidationService } from './validations/user.validation.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly userValidation: UserValidationService,
  ) { }

  async create(data: CreateClientDto | CreateDriverDto) {
    try {
      const validationErrors = await this.validateUniqueFields({
        email: data.email,
        cpf: (data as CreateDriverDto).cpf,
        phone: data.phone,
        number_cnh: (data as CreateDriverDto).number_cnh,
        plate: (data as CreateDriverDto).plate,
      });
  
      if (validationErrors.length > 0) {
        return {
          data: null,
          errorMessages: validationErrors,
        };
      }
  
      const hashedPassword = await bcrypt.hash(data.password, 10);
  
      return await this.prisma.$transaction(async (prisma) => {
        const wallet = await this.createWallet(prisma);
  
        const user = await this.createUser(prisma, data, hashedPassword, wallet.id);
  
        if (user.roleId === 3) {
          return await this.createDriverData(prisma, data as CreateDriverDto, user.id);
        }
  
        return {
          data: {
            message: 'Cliente criado com sucesso',
            user,
            wallet,
          },
          errorMessages: [],
        };
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return {
        data: null,
        errorMessages: [error.message],
      };
    }
  }

  private async createWallet(prisma: any) {
    return prisma.wallet.create({
      data: { balance: 0 },
    });
  }

  private async createUser(prisma: any, data: CreateClientDto | CreateDriverDto, hashedPassword: string, walletId: number) {
    const { number_cnh, img_front_cnh_url, img_back_cnh_url, plate, img_plate_url, ...userData } = data as CreateDriverDto;
    
    return prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword,
        walletId,
      },
    });
  }

  private async createDriverData(prisma: any, driverData: CreateDriverDto, userId: number) {
    const vehicleId = await this.createVehicleIfNeeded(prisma, driverData);

    const driver = await prisma.drivers.create({
      data: {
        userId,
        number_cnh: driverData.number_cnh,
        img_front_cnh_url: driverData.img_front_cnh_url,
        img_back_cnh_url: driverData.img_back_cnh_url,
        status: 'PENDING',
      },
    });

    if (vehicleId) {
      await prisma.driverVehicles.create({
        data: {
          driver_id: driver.id,
          vehicle_id: vehicleId,
        },
      });
    }

    return {
      message: 'Motorista criado com sucesso',
      user: await prisma.users.findUnique({ where: { id: userId } }),
      wallet: await prisma.wallet.findFirst({ where: { users: { some: { id: userId } } } }),
      driver,
    };
  }

  private async createVehicleIfNeeded(prisma: any, driverData: CreateDriverDto) {
    if (!driverData.plate && !driverData.img_plate_url) return null;

    const vehicle = await prisma.vehicles.create({
      data: {
        plate: driverData.plate,
        img_plate_url: driverData.img_plate_url,
      },
    });

    return vehicle.id;
  }

  async findAll() {
    try {
      const users = await this.prisma.users.findMany();
      return {
        data: users,
        errorMessages: [],
      };
    } catch (error) {
      return {
        data: null,
        errorMessages: [error.message],
      };
    }
  }

  async findOne(id: number) {
    const errorMessages: string[] = [];

    const userExists = await this.userValidation.validateUserExistsById(id);
    if (userExists) errorMessages.push(userExists.message);

    if (errorMessages.length > 0) {
      throw new NotFoundException({
        data: null,
        errorMessages
      })
    }

    const user = await this.prisma.users.findUnique({ 
      where: { id },
     });

    return { data: user, errorMessages }
  }

  async findMe(id: number){
    const errorMessages: string[] = [];

    const userExists = await this.userValidation.validateUserExistsById(id);
    if (userExists) errorMessages.push(userExists.message);

     if (errorMessages.length > 0) {
      throw new NotFoundException({
        data: null,
        errorMessages
      })
    }

     const user = await this.prisma.users.findUnique({ 
      where: { id },
      select:{
        id: true,
        full_name: true,
        email: true
      },
     });

    return { data: user, errorMessages }
  }

  async update(id: number, data: UpdateUserDto) {
    const errorMessages: string[] = [];

    const userExists = await this.userValidation.validateUserExistsById(id);
    if (userExists) errorMessages.push(userExists.message);

    if (errorMessages.length > 0) {
      throw new NotFoundException({
        data: null,
        errorMessages
      })
    }

    const user = await this.prisma.users.update({ where: { id }, data });

    return { data: user, errorMessages }
  }

  async remove(id: number) {
    const errorMessages: string[] = [];

    const userExists = await this.userValidation.validateUserExistsById(id);
    
    if (errorMessages.length > 0) {
      throw new NotFoundException({
        data: null,
        errorMessages
      })
    }

    const user = await this.prisma.users.delete({ where: { id } });

    return { data: user, errorMessages }
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    return this.prisma.users.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async findOneByRefreshToken(refreshToken: string) {
  return this.prisma.users.findFirst({ 
    where: { 
      refreshToken 
    } 
  });
}

  async findOneForAuth(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async validateUniqueFields(data: { email?: string; cpf?: string; phone?: string; number_cnh?: string; plate?: string }) {
    const errorMessages: string[] = [];

    if (data.email) {
      const existingUser = await this.prisma.users.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        errorMessages.push('Este e-mail já está em uso.');
      }
    }

    if (data.cpf) {
      const existingUser = await this.prisma.users.findUnique({
        where: { cpf: data.cpf },
      });
      if (existingUser) {
        errorMessages.push('Este CPF já está cadastrado.');
      }
    }

    if (data.phone) {
      const existingUser = await this.prisma.users.findUnique({
        where: { phone: data.phone },
      });
      if (existingUser) {
        errorMessages.push('Este telefone já está cadastrado.');
      }
    }

    if (data.number_cnh) {
      const existingDriver = await this.prisma.drivers.findUnique({
        where: { number_cnh: data.number_cnh },
      });
      if (existingDriver) {
        errorMessages.push('Esta CNH já está cadastrada.');
      }
    }

    if (data.plate) {
      const existingVehicle = await this.prisma.vehicles.findUnique({
        where: { plate: data.plate },
      });
      if (existingVehicle) {
        errorMessages.push('Esta placa já está cadastrada.');
      }
    }

    return errorMessages;
  }
}
