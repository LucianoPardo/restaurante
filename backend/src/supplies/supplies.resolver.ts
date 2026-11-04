import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { MessageResponse } from '../common/message.response';
import { Role } from '../users/role.enum';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';
import { SUPPLY_CATEGORIES } from './supplies.constants';
import { SuppliesService } from './supplies.service';

// El "controller" de GraphQL: usa el mismo service que SuppliesController
@Roles(Role.Admin)
@Resolver(() => Supply)
export class SuppliesResolver {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Query(() => [Supply])
  supplies(@Args('category', { nullable: true }) category?: string) {
    return this.suppliesService.findAll(category);
  }

  @Query(() => Supply)
  supply(@Args('id', { type: () => Int }) id: number) {
    return this.suppliesService.findOne(id);
  }

  @Query(() => [String])
  supplyCategories() {
    return SUPPLY_CATEGORIES;
  }

  @Mutation(() => Supply)
  createSupply(@Args('input') input: CreateSupplyDto) {
    return this.suppliesService.create(input);
  }

  @Mutation(() => Supply)
  updateSupply(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateSupplyDto,
  ) {
    return this.suppliesService.update(id, input);
  }

  @Mutation(() => MessageResponse)
  removeSupply(@Args('id', { type: () => Int }) id: number) {
    return this.suppliesService.remove(id);
  }
}
