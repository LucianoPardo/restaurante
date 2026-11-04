import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

const MAX_ACTIVE_RESERVATIONS = 3;

function today(): string {
  return new Date().toLocaleDateString('en-CA');
}

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {}

  async create(userId: number, createReservationDto: CreateReservationDto) {
    if (createReservationDto.fecha < today()) {
      throw new BadRequestException('No puedes reservar en una fecha pasada');
    }

    const active = await this.reservationsRepository.countBy({
      user: { id: userId },
      fecha: MoreThanOrEqual(today()),
    });
    if (active >= MAX_ACTIVE_RESERVATIONS) {
      throw new BadRequestException(`Ya tienes el máximo de ${MAX_ACTIVE_RESERVATIONS} reservas activas`);
    }

    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      user: { id: userId },
    });
    return await this.reservationsRepository.save(reservation);
  }

  async findMine(userId: number) {
    return await this.reservationsRepository.find({
      where: { user: { id: userId } },
      order: { fecha: 'ASC' },
    });
  }

  async findAll() {
    return await this.reservationsRepository.find({
      relations: { user: true },
      order: { fecha: 'ASC' },
    });
  }

  async cancel(id: number, userId: number) {
    const reservation = await this.reservationsRepository.findOneBy({ id, user: { id: userId } });
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }
    await this.reservationsRepository.remove(reservation);
    return { message: 'Reserva cancelada' };
  }
}
