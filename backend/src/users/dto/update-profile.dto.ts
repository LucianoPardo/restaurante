import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';

@InputType('UpdateProfileInput')
export class UpdateProfileDto extends PartialType(CreateUserDto) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  direccion?: string;

  // Antes se llamaba "celular" y no coincidía con la columna "telefono" de la entidad
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;
}
