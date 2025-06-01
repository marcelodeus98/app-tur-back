import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';

export class CreatePackageDto {
  @IsString({message: 'O nome do pacote deve ser uma string'})
  @IsNotEmpty({message: 'O nome do pacote é obrigatório'})
  name: string;

  @IsString({message: 'A descrição do pacote deve ser uma string'})
  @IsNotEmpty({message: 'A descrição do pacote é obrigatória'})
  description: string;

  @IsNumber({}, {message: 'O ponto de origem deve ser um número'})
  @IsNotEmpty({message: 'O ponto de origem é obrigatório'})
  point_origin_id: number;

  @IsNumber({}, {message: 'O ponto de destino deve ser um número'})
  @IsNotEmpty({message: 'O ponto de destino é obrigatório'})
  point_destination_id: number;

  @IsString({message: 'O ponto de partida deve ser uma string'})
  @IsNotEmpty({message: 'O ponto de partida é obrigatório'})
  starting_point: string;

  @IsNumber({}, {message: 'A duração do pacote deve ser um número'})
  @IsNotEmpty({message: 'A duração do pacote é obrigatória'})
  duration: number;

  @IsNumber({}, {message: 'A distância do pacote deve ser um número'})
  @IsNotEmpty({message: 'A distância do pacote é obrigatória'})
  distance: number;

  @IsNumber({}, {message: 'O valor da taxa deve ser um número'})
  @IsNotEmpty({message: 'O valor da taxa é obrigatório'})
  rate: number;

  @IsNumber({}, {message: 'O valor do pacote deve ser um número'})
  @IsNotEmpty({message: 'O valor do pacote é obrigatório'})
  amount: number;

  @IsArray()
  @IsNotEmpty({message: 'Os pontos de parada são obrigatórios'})
  stops: string[];
}
