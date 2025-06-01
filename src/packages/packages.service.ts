import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

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

  async findAll() {
    const packages = await this.prisma.packages.findMany();
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
}
