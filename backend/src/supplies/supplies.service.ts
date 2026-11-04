import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectRepository(Supply)
    private readonly suppliesRepository: Repository<Supply>,
  ) {}

  async create(createSupplyDto: CreateSupplyDto) {
    await this.checkNameIsFree(createSupplyDto.name);
    const supply = this.suppliesRepository.create(createSupplyDto);
    return await this.suppliesRepository.save(supply);
  }

  async findAll(category?: string) {
    if (category) {
      return await this.suppliesRepository.findBy({ category });
    }
    return await this.suppliesRepository.find();
  }

  async findOne(id: number) {
    const supply = await this.suppliesRepository.findOneBy({ id });
    if (!supply) {
      throw new NotFoundException(`No existe el insumo con id ${id}`);
    }
    return supply;
  }

  async update(id: number, updateSupplyDto: UpdateSupplyDto) {
    const supply = await this.findOne(id);
    if (updateSupplyDto.name && updateSupplyDto.name !== supply.name) {
      await this.checkNameIsFree(updateSupplyDto.name);
    }
    Object.assign(supply, updateSupplyDto);
    return await this.suppliesRepository.save(supply);
  }

  async remove(id: number) {
    const supply = await this.findOne(id);
    await this.suppliesRepository.remove(supply);
    return { message: 'Insumo eliminado' };
  }

  private async checkNameIsFree(name: string) {
    const existing = await this.suppliesRepository.findOneBy({ name });
    if (existing) {
      throw new ConflictException('Ya existe un insumo con ese nombre');
    }
  }
}
