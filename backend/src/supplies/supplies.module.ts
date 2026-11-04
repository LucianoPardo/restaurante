import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { SuppliesResolver } from './supplies.resolver';
import { Supply } from './entities/supply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supply])],
  controllers: [SuppliesController],
  providers: [SuppliesService, SuppliesResolver],
})
export class SuppliesModule {}
