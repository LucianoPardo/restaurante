import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesResolver } from './employees.resolver';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, EmployeesController],
  providers: [UsersService, UsersResolver, EmployeesResolver],
  exports: [UsersService],
})
export class UsersModule {}
