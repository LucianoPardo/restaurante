import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';

@Roles(Role.Admin)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get('monthly')
  monthlySummary() {
    return this.salesService.monthlySummary();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.remove(id);
  }
}
