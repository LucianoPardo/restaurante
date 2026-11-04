import { IsIn } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';
import { Role } from '../role.enum';

@InputType('CreateEmployeeInput')
export class CreateEmployeeDto extends CreateUserDto {
  @Field(() => String)
  @IsIn([Role.Empleado, Role.Admin], {
    message: 'El rol debe ser empleado o admin',
  })
  role!: Role;
}
