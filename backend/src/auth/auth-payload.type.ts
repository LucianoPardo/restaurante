import { Field, Int, ObjectType } from '@nestjs/graphql';

// Lo que devuelve el login: el token y los datos básicos del usuario
@ObjectType()
export class AuthUser {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  access_token: string;

  @Field(() => AuthUser)
  user: AuthUser;
}
