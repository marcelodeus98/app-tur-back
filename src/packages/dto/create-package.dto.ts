import { IsNumber, IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePackageDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({message: 'O id do motorista é obrigatório'})
  @IsNumber({},{message: 'O id do motorista deve ser um número'})
  driver_id: number;

  @ApiProperty({ example: 'Pacote Barra Nova' })
  @IsNotEmpty({message: 'O nome é obrigatório'})
  @IsString({message: 'O nome deve ser uma string'})
  name: string;

  @ApiProperty({ example: 'Pacote de viagem para Barra Nova' })
  @IsOptional({ message: 'A descrição é opcional' })
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({message: 'O id do ponto de partida é obrigatório'})
  @IsNumber({}, {message: 'O id do ponto de partida deve ser um número'})
  point_origin_id: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty({message: 'O id do ponto de chegada é obrigatório'})
  @IsNumber({}, {message: 'O id do ponto de chegada deve ser um número'})
  @IsNumber()
  point_destination_id: number;

  @ApiProperty({ example: 'Ponto de partida - barraca Encontro das Águas' })
  @IsOptional()
  @IsString({ message: 'O ponto de partida deve ser uma string' })
  starting_point?: string;

  @ApiProperty({ example: 1.5 })
  @IsNotEmpty({ message: 'A duração é obrigatória' })
  @IsNumber({ maxDecimalPlaces: 2 })
  duration: number;

  @ApiProperty({ example: 5.5 })
  @IsNotEmpty({ message: 'A distância é obrigatória' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  distance?: number;

  @ApiProperty({ example: 5.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  rate: number;

  @ApiProperty({ example: 70 })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({ example: ['Ponto 1', 'Ponto 2'] })
  @IsOptional()
  @IsArray({ message: 'As paradas devem ser um array' })
  stops: string[];

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'O id do veículo é obrigatório' })
  @IsNumber({}, { message: 'O id do veículo deve ser um número' })
  vehicle_id: number;
}
