import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { Role } from '../users/role.enum';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(Role.Cliente)
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(user.sub, createReservationDto);
  }

  @Roles(Role.Cliente)
  @Get('mine')
  findMine(@CurrentUser() user: JwtPayload) {
    return this.reservationsService.findMine(user.sub);
  }

  @Roles(Role.Admin, Role.Empleado)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Roles(Role.Cliente)
  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.reservationsService.cancel(id, user.sub);
  }
}
