import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { SUPPLY_CATEGORIES } from '../supplies.constants';

// Sirve como body en REST y como "input" en GraphQL; las validaciones valen para los dos
@InputType('CreateSupplyInput')
export class CreateSupplyDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre del insumo es obligatorio' })
  @MaxLength(100)
  name: string;

  @Field()
  @IsIn(SUPPLY_CATEGORIES, { message: 'La categoría del insumo no es válida' })
  category: string;

  @Field(() => Int)
  @IsInt({ message: 'La cantidad del insumo debe ser un número entero' })
  @Min(0, { message: 'La cantidad del insumo no puede ser negativa' })
  quantity: number;

  @Field(() => Float)
  @IsNumber({}, { message: 'El precio del insumo debe ser un número' })
  @Min(0, { message: 'El precio del insumo no puede ser negativo' })
  price: number;
}
