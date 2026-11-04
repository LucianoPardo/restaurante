import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { MessageResponse } from '../common/message.response';
import { Role } from '../users/role.enum';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { MonthlySales } from './monthly-sales.type';
import { SalesService } from './sales.service';

@Roles(Role.Admin)
@Resolver(() => Sale)
export class SalesResolver {
  constructor(private readonly salesService: SalesService) {}

  @Query(() => [Sale])
  sales() {
    return this.salesService.findAll();
  }

  @Query(() => MonthlySales)
  monthlySales() {
    return this.salesService.monthlySummary();
  }

  @Mutation(() => Sale)
  createSale(@Args('input') input: CreateSaleDto) {
    return this.salesService.create(input);
  }

  @Mutation(() => MessageResponse)
  removeSale(@Args('id', { type: () => Int }) id: number) {
    return this.salesService.remove(id);
  }
}
