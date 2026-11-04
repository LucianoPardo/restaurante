import { IsDateString, IsNumber, Matches, Min } from 'class-validator';
import { Field, Float, InputType } from '@nestjs/graphql';

@InputType('CreateSaleInput')
export class CreateSaleDto {
  @Field()
  @IsDateString({ strict: true }, { message: 'La fecha no es válida' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener el formato AAAA-MM-DD',
  })
  fecha: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0, { message: 'El monto no puede ser negativo' })
  monto: number;
}
