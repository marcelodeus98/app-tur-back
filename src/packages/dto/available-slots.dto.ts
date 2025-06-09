import { ApiProperty } from '@nestjs/swagger';

export class AvailableSlotDto {
  @ApiProperty({ example: '08:00', description: 'Horário disponível' })
  hour: string;

  @ApiProperty({ example: 4, description: 'Número de vagas disponíveis' })
  availableSeats: number;

  @ApiProperty({ example: 4, description: 'Número total de vagas no veículo' })
  totalSeats: number;
}

export class AvailableSlotsResponseDto {
  @ApiProperty({
    example: 'Horários disponíveis encontrados',
    description: 'Mensagem de sucesso',
  })
  message: string;

  @ApiProperty({ type: [AvailableSlotDto], description: 'Lista de horários disponíveis' })
  slots: AvailableSlotDto[];
}