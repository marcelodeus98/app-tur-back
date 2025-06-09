import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { FindPackagesDto } from './dto/find-packages.dto';
import { AvailableSlotsResponseDto } from './dto/available-slots.dto';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiConflictResponse, ApiExtraModels, ApiBody, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar um pacote' })
  @ApiResponse({ status: 201, description: 'Pacote criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiConflictResponse({ description: 'Pacote já cadastrado' })
  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os pacotes por filtro de um intervalo de data.' })
  @ApiResponse({ status: 200, description: 'Pacotes obtidos com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @Get()
  findAll(@Query() filters: FindPackagesDto) {
    return this.packagesService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter um pacote' })
  @ApiResponse({ status: 200, description: 'Pacote obtido com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar um pacote' })
  @ApiResponse({ status: 200, description: 'Pacote atualizado com sucesso' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @ApiConflictResponse({ description: 'Pacote já registrado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(+id, updatePackageDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obter horários disponíveis para um pacote',
    description: 'Retorna os horários disponíveis para agendamento em uma data específica'
  })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    example: '2023-12-25',
    description: 'Data para verificação de disponibilidade (formato YYYY-MM-DD)'
  })
  @ApiResponse({
    status: 200,
    description: 'Horários disponíveis retornados com sucesso',
    type: AvailableSlotsResponseDto
  })
  @ApiBadRequestResponse({ description: 'Data inválida ou parâmetros incorretos' })
  @ApiResponse({ status: 404, description: 'Pacote não encontrado' })
  @Get(':id/available-slots')
  async getAvailableSlots(
    @Param('id') id: string,
    @Query('date') dateString: string
  ) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Data inválida');
    }

    return await this.packagesService.getAvailableSlots(parseInt(id), date);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover um pacote' })
  @ApiResponse({ status: 200, description: 'Pacote removido com sucesso' })
  @ApiBadRequestResponse({ description: 'Pacote não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(+id);
  }
}
