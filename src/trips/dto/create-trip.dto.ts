import { IsNotEmpty, IsString, IsNumber, Matches, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O id do motorista é obrigatório' })
    @IsNumber({}, { message: 'O id do motorista deve ser um número' })
    client_id: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O id do pacote é obrigatório' })
    @IsNumber({}, { message: 'O id do pacote deve ser um número' })
    package_id: number;

    @ApiProperty({ example: '2025-06-09T09:00:00' })
    @IsNotEmpty({ message: 'A data de reserva é obrigatória' })
    @IsDateString({}, { message: 'Formato de data inválido. Use YYYY-MM-DDTHH:mm:ss' })
    schedule_date: string;

    @ApiProperty({ example: 2 })
    @IsNotEmpty({ message: 'A quantidade de assentos é obrigatório' })
    @IsNumber({}, { message: 'A quantidade de assentos deve ser um número' })
    quantity_seats: number

    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O id do tipo de pagamento é obrigatório' })
    @IsNumber({}, { message: 'O id do tipo de pagamento deve ser um número' })
    payment_types_id: number
}
