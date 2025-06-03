import { IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindPackagesDto {
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString() : undefined)
  start_date?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString() : undefined)
  end_date?: string;
} 