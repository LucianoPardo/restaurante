import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { SUPPLY_CATEGORIES } from './supplies.constants';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';

@Roles(Role.Admin)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.suppliesService.findAll(category);
  }

  @Get('categories')
  getCategories() {
    return SUPPLY_CATEGORIES;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ) {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suppliesService.remove(id);
  }
}
