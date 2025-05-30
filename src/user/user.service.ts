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
  
      const result = await this.prisma.$transaction(async (prisma) => {
        const wallet = await prisma.wallet.create({
          data: {
            balance: 0,
          },
        });
  
        const { number_cnh, img_front_cnh_url, img_back_cnh_url, plate, img_plate_url, ...userData } = data as CreateDriverDto;
  
        const user = await prisma.users.create({
          data: {
            ...userData,
            password: hashedPassword,
            walletId: wallet.id,
          },
        });
  
        if (user.roleId === 3) {
          const driverData = data as CreateDriverDto;
  
          let vehicleId: number | null = null;
          if (driverData.plate || driverData.img_plate_url) {
            const vehicle = await prisma.vehicles.create({
              data: {
                plate: driverData.plate,
                img_plate_url: driverData.img_plate_url,
              },
            });
            vehicleId = vehicle.id;
          }
  
          const driver = await prisma.drivers.create({
            data: {
              userId: user.id,
              number_cnh: driverData.number_cnh,
              img_front_cnh_url: driverData.img_front_cnh_url,
              img_back_cnh_url: driverData.img_back_cnh_url,
              vehicle_id: vehicleId,
              status: 'PENDING',
            },
          });
  
          return {
            message: 'Motorista criado com sucesso',
            user,
            wallet,
            driver,
          };
        }
  
        return {
          message: 'Cliente criado com sucesso',
          user,
          wallet,
        };
      });
  
      return {
        data: result,
        errorMessages: [],
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return {
        data: null,
        errorMessages: [error.message],
      };
    }
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

  async findOneForAuth(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async validateUniqueFields(data: { email?: string; cpf?: string; phone?: string; number_cnh?: string; plate?: string }) {
    const errorMessages: string[] = [];

    if (data.email) {
      try {
        await this.userValidation.validateUserExistsByEmail(data.email);
        errorMessages.push('Este e-mail já está em uso.');
      } catch (error) {
        console.log(error);
      }
    }

    if (data.cpf) {
      try {
        const user = await this.prisma.users.findUnique({
          where: { cpf: data.cpf },
        });
        if (user) {
          errorMessages.push('Este CPF já está cadastrado.');
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (data.phone) {
      try {
        const user = await this.prisma.users.findUnique({
          where: { phone: data.phone },
        });
        if (user) {
          errorMessages.push('Este telefone já está cadastrado.');
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (data.number_cnh) {
      const user = await this.userValidation.validateExistsCNH(data.number_cnh);
      if (user) errorMessages.push('Esta CNH já está cadastrada.');
    }

    if (data.plate) {
      const vehicle = await this.userValidation.validateExistsPlate(data.plate);
      if (vehicle) errorMessages.push('Esta placa já está cadastrada.');
    }
    return errorMessages;
  }
}
