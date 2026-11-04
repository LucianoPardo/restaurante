import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from './role.enum';
import { UsersService } from './users.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Roles(Role.Admin)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findEmployees();
  }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.usersService.create(createEmployeeDto, createEmployeeDto.role);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findEmployee(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentUser() me: JwtPayload,
  ) {
    return this.usersService.updateEmployee(id, updateEmployeeDto, me.sub);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() me: JwtPayload) {
    return this.usersService.removeEmployee(id, me.sub);
  }
}
