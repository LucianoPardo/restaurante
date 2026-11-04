import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { MessageResponse } from '../common/message.response';
import { Role } from '../users/role.enum';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(Role.Cliente)
  @Mutation(() => Reservation)
  createReservation(
    @CurrentUser() user: JwtPayload,
    @Args('input') input: CreateReservationDto,
  ) {
    return this.reservationsService.create(user.sub, input);
  }

  @Roles(Role.Cliente)
  @Query(() => [Reservation])
  myReservations(@CurrentUser() user: JwtPayload) {
    return this.reservationsService.findMine(user.sub);
  }

  @Roles(Role.Admin, Role.Empleado)
  @Query(() => [Reservation])
  reservations() {
    return this.reservationsService.findAll();
  }

  @Roles(Role.Cliente)
  @Mutation(() => MessageResponse)
  cancelReservation(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reservationsService.cancel(id, user.sub);
  }
}
