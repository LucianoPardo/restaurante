import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const sale = this.salesRepository.create(createSaleDto);
    return await this.salesRepository.save(sale);
  }

  async findAll() {
    return await this.salesRepository.find({ order: { fecha: 'DESC' } });
  }

  async monthlySummary() {
    const rows = await this.salesRepository
      .createQueryBuilder('sale')
      .select("DATE_FORMAT(sale.fecha, '%Y-%m')", 'mes')
      .addSelect('SUM(sale.monto)', 'total')
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany<{ mes: string; total: string }>();

    return {
      labels: rows.map((row) => row.mes),
      data: rows.map((row) => Number(row.total)),
    };
  }

  async remove(id: number) {
    const sale = await this.salesRepository.findOneBy({ id });
    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }
    await this.salesRepository.remove(sale);
    return { message: 'Venta eliminada' };
  }
}
