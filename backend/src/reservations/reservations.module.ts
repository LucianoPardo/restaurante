import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsResolver } from './reservations.resolver';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsResolver],
})
export class ReservationsModule {}
