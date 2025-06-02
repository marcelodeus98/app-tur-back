import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OperationHourItemDto {
    @ApiProperty({ example: 'saturday' })
    @IsNotEmpty({ message: 'O week_day é obrigatório' })
    @IsString({ message: 'O week_day deve ser uma string' })
    week_day: string;

    @ApiProperty({ example: '08:00' })
    @IsNotEmpty({ message: 'O start_time é obrigatório' })
    @IsString({ message: 'O start_time deve ser uma string' })
    start_time: string;

    @ApiProperty({ example: '12:00' })
    @IsOptional()
    @IsString({ message: 'O break_start deve ser uma string' })
    break_start?: string;

    @ApiProperty({ example: '13:00' })
    @IsOptional()
    @IsString({ message: 'O break_end deve ser uma string' })
    break_end?: string;

    @ApiProperty({ example: '18:00' })
    @IsNotEmpty({ message: 'O end_time é obrigatório' })
    @IsString({ message: 'O end_time deve ser uma string' })
    end_time: string;
} 