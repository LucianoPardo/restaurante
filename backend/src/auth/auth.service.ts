import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    const passwordOk = user && (await bcrypt.compare(loginDto.password, user.password));

    if (!user || !passwordOk) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const payload = { sub: user.id, role: user.role };
    return {
        access_token: this.jwtService.sign(payload),
        user: {id: user.id, name: user.name, role: user.role },
    };
  }
}