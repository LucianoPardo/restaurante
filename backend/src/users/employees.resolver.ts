import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { MessageResponse } from '../common/message.response';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from './entities/user.entity';
import { Role } from './role.enum';
import { UsersService } from './users.service';

// Gestión de empleados (equivale a EmployeesController)
@Roles(Role.Admin)
@Resolver(() => User)
export class EmployeesResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  employees() {
    return this.usersService.findEmployees();
  }

  @Query(() => User)
  employee(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findEmployee(id);
  }

  @Mutation(() => User)
  createEmployee(@Args('input') input: CreateEmployeeDto) {
    return this.usersService.create(input, input.role);
  }

  @Mutation(() => User)
  updateEmployee(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateEmployeeDto,
    @CurrentUser() me: JwtPayload,
  ) {
    return this.usersService.updateEmployee(id, input, me.sub);
  }

  @Mutation(() => MessageResponse)
  removeEmployee(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() me: JwtPayload,
  ) {
    return this.usersService.removeEmployee(id, me.sub);
  }
}
