import { IsNumber, IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreatePackageDto {
  @IsNumber()
  driver_id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  point_origin_id: number;

  @IsNumber()
  point_destination_id: number;

  @IsString()
  @IsOptional()
  starting_point?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  duration: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  distance?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  rate: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsArray()
  stops: string[];

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
