import { Field, Float, ObjectType } from '@nestjs/graphql';

// Datos listos para el gráfico: meses ("2026-09") y el total de cada uno
@ObjectType()
export class MonthlySales {
  @Field(() => [String])
  labels: string[];

  @Field(() => [Float])
  data: number[];
}
