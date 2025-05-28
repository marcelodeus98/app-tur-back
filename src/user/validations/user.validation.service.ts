import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { NoFoundItem, DuplicatedItem } from "src/shared/utils/errors/modules_errors";

@Injectable()
export class UserValidationService {
  constructor(private prisma: PrismaService) {}

  async validateExistsCPF(data: CreateUserDto | UpdateUserDto): Promise<{ error: string; cpf: string } | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        cpf: data.cpf
      }
    })
    
    return user ? { error: 'CPF já registrado.', cpf: user.cpf || '' } : null;
  }
  
  async validateExistsEmail(data: CreateUserDto | UpdateUserDto): Promise<{ error: string; email: string } | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email
      }
    })
    
    return user ? { error: 'Email já registrado.', email: user.email } : null;
  }

  async validateExistsPhone(data: CreateUserDto | UpdateUserDto): Promise<{ error: string; phone?: string } | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        contact: data.phone
      }
    })
    
    return user ? { error: 'Celular já registrado.', phone: user.contact || undefined } : null;
  }

   async validateUserExistsById(id: number): Promise<NoFoundItem | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user ? null : new NoFoundItem('Usuário');
  }

   async validateUserExistsByEmail(email: string): Promise<NoFoundItem | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user ? null : new NoFoundItem('Usuário');
  }

  async validateCpfExists(cpf: string) {
    const user = await this.prisma.user.findFirst({
      where: { cpf }
    });
    return user ? { error: 'CPF já registrado.', cpf: user.cpf || '' } : null;
  }

  async validateContactExists(contact: string) {
    const user = await this.prisma.user.findFirst({
      where: { contact }
    });
    return user ? { error: 'Contato já registrado.', contact: user.contact || '' } : null;
  }
}
