import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('CreateReservationInput')
export class CreateReservationDto {
  @Field()
  @IsDateString({ strict: true }, { message: 'La fecha no es válida' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener el formato AAAA-MM-DD',
  })
  fecha: string;

  @Field(() => Int)
  @IsInt({ message: 'El número de personas debe ser un número entero' })
  @Min(1, { message: 'Debe haber al menos 1 persona' })
  @Max(10, { message: 'El máximo es 10 personas' })
  numeroPersonas: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  comentario?: string;
}
