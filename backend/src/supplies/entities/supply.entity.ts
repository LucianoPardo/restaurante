import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

// @Entity → tabla de MySQL (TypeORM) · @ObjectType → tipo de GraphQL.
// La misma clase sirve para las dos cosas.
@ObjectType()
@Entity()
export class Supply {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100, unique: true })
  name: string;

  @Field()
  @Column({ length: 100 })
  category: string;

  @Field(() => Int)
  @Column('int')
  quantity: number;

  @Field(() => Float)
  @Column('float')
  price: number;
}
