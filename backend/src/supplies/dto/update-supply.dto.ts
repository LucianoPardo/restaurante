import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSupplyDto } from './create-supply.dto';

// PartialType de @nestjs/graphql (no el de mapped-types) para que también genere el tipo de GraphQL
@InputType('UpdateSupplyInput')
export class UpdateSupplyDto extends PartialType(CreateSupplyDto) {}
