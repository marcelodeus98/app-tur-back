import {IsEmail, IsString, IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateAuthLoginDto {
    @ApiProperty({example: 'john.doe@example.com'})
    @IsNotEmpty({message: 'O e-mail é obrigatório'})
    @IsEmail({}, {message: 'O e-mail deve ser válido.'})
    email: string;

    @ApiProperty({example: 'strongpassword123'})
    @IsNotEmpty({message: 'A senha é obrigatória'})
    @IsString()
    password: string;
}