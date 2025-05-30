import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { NoFoundItem, DuplicatedItem } from "src/shared/utils/errors/modules_errors";

@Injectable()
export class UserValidationService {
  constructor(private prisma: PrismaService) {}

  async validateExistsCPF(data: CreateUserDto | UpdateUserDto): Promise<{ error: string; cpf: string } | null> {
    const user = await this.prisma.users.findFirst({
      where: {
        cpf: data.cpf
      }
    })
    
    return user ? { error: 'CPF já registrado.', cpf: user.cpf || '' } : null;
  }

  async validateExistsPhone(data: CreateUserDto | UpdateUserDto): Promise<{ error: string; phone?: string } | null> {
    const user = await this.prisma.users.findFirst({
      where: {
        phone: data.phone
      }
    })
    
    return user ? { error: 'Celular já registrado.', phone: user.phone|| undefined } : null;
  }

  async validateUserExistsById(id: number): Promise<{ message: string } | null> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      return { message: 'Usuário não encontrado' };
    }
    return null;
  }
  
  async validateUserExistsByEmail(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async validateExistsCNH(cnh: string) {
    const user = await this.prisma.drivers.findFirst({
      where: {
        number_cnh: cnh
      }
    })

    return user ? { error: 'CNH já registrada.', cnh: user.number_cnh || '' } : null;
  }

  async validateExistsPlate(plate: string) {
    console.log(plate);
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { plate },
    });
    
    if (vehicle) {
      return { error: 'Esta placa já está cadastrada.' };
    }
    
    return null;
  }
}
