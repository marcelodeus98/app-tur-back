import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  @IsString({ message: 'O nome completo deve ser uma string.' })
  full_name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;

  @ApiProperty({ example: 'strongpassword123' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @IsString()
  password: string;

  @ApiProperty({ example: '(11) 91234-5678', required: false })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  phone?: string;

  @ApiProperty({ example: 'google-id-123', required: false })
  @IsOptional()
  @IsString()
  google_id?: string;

  @ApiProperty({ example: 'google', required: false })
  @IsOptional()
  @IsString()
  auth_provider?: string;

  @ApiProperty({ example: 2, description: 'ID do papel do usuário (2 = client)' })
  @IsNotEmpty({ message: 'O roleId é obrigatório' })
  @IsNumber({}, { message: 'O roleId deve ser um número' })
  roleId: number;
} 