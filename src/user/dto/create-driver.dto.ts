import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';

export class CreateDriverDto extends CreateClientDto {
  @ApiProperty({ example: '123.456.789-00', required: false })
  @IsOptional()
  @IsString({ message: 'O CPF deve ser uma string.' })
  cpf?: string;

  @ApiProperty({ example: '1234567', required: false })
  @IsOptional()
  @IsString({ message: 'O RG deve ser uma string.' })
  rg?: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString({ message: 'A CNH deve ser uma string.' })
  cnh?: string;

  @ApiProperty({ example: 'https://cnh-front-url.com', required: false })
  @IsOptional()
  @IsString({ message: 'A URL da frente da CNH deve ser uma string.' })
  cnh_front_url?: string;

  @ApiProperty({ example: 'https://cnh-back-url.com', required: false })
  @IsOptional()
  @IsString({ message: 'A URL de trás da CNH deve ser uma string.' })
  cnh_back_url?: string;

  @ApiProperty({ example: 'ABC1234', required: false })
  @IsOptional()
  @IsString({ message: 'A placa deve ser uma string.' })
  plate?: string;

  @ApiProperty({ example: 'https://plate-url.com', required: false })
  @IsOptional()
  @IsString({ message: 'A URL da placa deve ser uma string.' })
  plate_url?: string;
} 