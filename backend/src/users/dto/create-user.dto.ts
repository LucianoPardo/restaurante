import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateUserInput')
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(80)
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(80)
  lastName: string;

  @Field()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
