import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

// Registro y "mi perfil" (equivale a UsersController)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Mutation(() => User)
  register(@Args('input') input: CreateUserDto) {
    return this.usersService.create(input);
  }

  @Query(() => User)
  me(@CurrentUser() user: JwtPayload) {
    return this.usersService.findOne(user.sub);
  }

  @Mutation(() => User)
  updateMe(
    @CurrentUser() user: JwtPayload,
    @Args('input') input: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.sub, input);
  }
}
