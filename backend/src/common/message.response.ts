import { Field, ObjectType } from '@nestjs/graphql';

// Respuesta { message } que devuelven las acciones de eliminar y cancelar
@ObjectType()
export class MessageResponse {
  @Field()
  message: string;
}
