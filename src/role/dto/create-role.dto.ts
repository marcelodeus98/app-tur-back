import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'create-user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Descrição da permissão' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'slug' })
  @IsNotEmpty()
  @IsString()
  slug: string;
}
