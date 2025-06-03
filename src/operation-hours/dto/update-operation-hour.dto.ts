import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OperationHourItemDto } from './operation-hour-item.dto';

export class UpdateOperationHourDto {
    @ApiProperty({ type: [OperationHourItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OperationHourItemDto)
    operation_hours: OperationHourItemDto[];
}
