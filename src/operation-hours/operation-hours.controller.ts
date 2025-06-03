import { Controller, Get, Post, Body, Patch, Param, UseGuards, } from '@nestjs/common';
import { OperationHoursService } from './operation-hours.service';
import { CreateOperationHourDto } from './dto/create-operation-hour.dto';
import { UpdateOperationHourDto } from './dto/update-operation-hour.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('operation-hours')
@Controller('operation-hours')
export class OperationHoursController {
  constructor(private readonly operationHoursService: OperationHoursService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar horários de operação para um motorista' })
  @ApiResponse({ status: 201, description: 'Horários criados com sucesso' })
  create(@Body() createOperationHourDto: CreateOperationHourDto) {
    return this.operationHoursService.create(createOperationHourDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar horários de operação de um motorista' })
  @ApiResponse({ status: 200, description: 'Horários encontrados com sucesso' })
  findOne(@Param('id') id: string) {
    return this.operationHoursService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar horários de operação de um motorista' })
  @ApiResponse({ status: 200, description: 'Horários atualizados com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateOperationHourDto: UpdateOperationHourDto,
  ) {
    return this.operationHoursService.update(+id, updateOperationHourDto);
  }
}