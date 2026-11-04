import { InputType, PartialType } from '@nestjs/graphql';
import { CreateEmployeeDto } from './create-employee.dto';

@InputType('UpdateEmployeeInput')
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
