import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Reservation {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'date' })
  fecha: string;

  @Field(() => Int)
  @Column('int')
  numeroPersonas: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  comentario: string | null;

  // Solo viene cargado en la consulta del personal (relations: { user: true })
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
