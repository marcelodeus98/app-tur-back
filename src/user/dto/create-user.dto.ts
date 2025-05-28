import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { isEmpty } from 'rxjs';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve ser válida (YYYY-MM-DD).' })
  birthdate?: string;

  @ApiProperty({ example: '123.456.789-00', required: false })
  @IsNotEmpty({ message: 'O CPF é obrigatório.'})
  @IsString({ message: 'O CPF deve ser uma string.' })
  cpf: string;

  @ApiProperty({ example: 'Rua das Flores', required: false })
  @IsOptional()
  @IsString({ message: 'O endereço deve ser uma string.' })
  address?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: 'O número da casa deve ser uma string.' })
  houseNumber?: string;

  @ApiProperty({ example: 'Centro', required: false })
  @IsOptional()
  @IsString({ message: 'O bairro deve ser uma string.' })
  neighborhood?: string;

  @ApiProperty({ example: '12345-678', required: false })
  @IsOptional()
  @IsString({ message: 'O CEP deve ser uma string.' })
  zipCode?: string;

  @ApiProperty({ example: 'Apartamento 101', required: false })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  complement?: string;

  @ApiProperty({ example: '(11) 91234-5678', required: false })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  phone?: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsNotEmpty({ message: 'O e-mail é obrigatório '})
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;

  @ApiProperty({ example: 'strongpassword123', required: false })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @IsString()
  password: string;

  @ApiProperty({ example: true, required: false })
  @IsNotEmpty({ message: 'O campo is_active é obrigatório' })
  @IsBoolean({ message: 'O campo is_active deve ser booleano.' })
  is_active: boolean;

  @ApiProperty({ example: 1, description: 'ID da cidade', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'O ID da cidade deve ser um número.' })
  cityId?: number;
}
