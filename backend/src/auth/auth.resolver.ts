import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthPayload } from './auth-payload.type';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthPayload)
  login(@Args('input') input: LoginDto) {
    return this.authService.login(input);
  }
}
