import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from '../role.enum';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 80 })
  name: string;

  @Field()
  @Column({ length: 80 })
  lastName: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 120, nullable: true })
  direccion: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono: string | null;

  @Field()
  @Column({ length: 120, unique: true })
  email: string;

  // Sin @Field: la contraseña no existe en el esquema de GraphQL, nadie puede pedirla
  @Column()
  @Exclude()
  password: string;

  // En GraphQL viaja como texto ('cliente', 'empleado', 'admin'), igual que en REST
  @Field(() => String)
  @Column({ type: 'enum', enum: Role, default: Role.Cliente })
  role: Role;
}
