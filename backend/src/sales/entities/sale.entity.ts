import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Sale {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'date' })
  fecha: string;

  @Field(() => Float)
  @Column('float')
  monto: number;
}
