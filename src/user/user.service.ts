import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (data.roleId === 2) {
      return this.prisma.user.create({
        data: {
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          contact: data.contact,
          google_id: data.google_id,
          auth_provider: data.auth_provider,
          roleId: data.roleId,
        },
      });
    } else if (data.roleId === 3) {
      const driverData = data as CreateDriverDto;
      return this.prisma.user.create({
        data: {
          full_name: driverData.full_name,
          email: driverData.email,
          password: driverData.password,
          contact: driverData.contact,
          google_id: driverData.google_id,
          auth_provider: driverData.auth_provider,
          cpf: driverData.cpf,
          rg: driverData.rg,
          cnh: driverData.cnh,
          cnh_front_url: driverData.cnh_front_url,
          cnh_back_url: driverData.cnh_back_url,
          plate: driverData.plate,
          plate_url: driverData.plate_url,
          roleId: driverData.roleId,
        },
      });
    }
    throw new Error('Invalid roleId');
  }

  async findAll() {
    const errorMessages: string[] = [];

    const users = await this.prisma.user.findMany();

    return { data: users, errorMessages }
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

    const user = await this.prisma.user.findUnique({ 
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

     const user = await this.prisma.user.findUnique({ 
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

    const user = await this.prisma.user.update({ where: { id }, data });

    return { data: user, errorMessages }
  }

  async remove(id: number) {
    const errorMessages: string[] = [];

    const userExists = await this.userValidation.validateUserExistsById(id);
    if (userExists) errorMessages.push(userExists.message);

    if (errorMessages.length > 0) {
      throw new NotFoundException({
        data: null,
        errorMessages
      })
    }

    const user = await this.prisma.user.delete({ where: { id } });

    return { data: user, errorMessages }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async findOneForAuth(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
