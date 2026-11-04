import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType('LoginInput')
export class LoginDto {
  @Field()
  @IsEmail({}, { message: 'El Email no es válido' })
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
