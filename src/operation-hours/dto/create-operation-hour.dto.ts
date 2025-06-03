import { IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OperationHourItemDto } from './operation-hour-item.dto';

export class CreateOperationHourDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'O driver_id é obrigatório' })
    @IsNumber({}, { message: 'O driver_id deve ser um número' })
    driver_id: number;

    @ApiProperty({ type: [OperationHourItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OperationHourItemDto)
    operation_hours: OperationHourItemDto[];
}
