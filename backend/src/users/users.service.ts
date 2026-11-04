import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Role } from './role.enum';
import * as bcrypt from 'bcryptjs';

const EMPLOYEE_ROLES = [Role.Empleado, Role.Admin];

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const admins = await this.usersRepository.countBy({ role: Role.Admin });
    if (admins > 0) {
      return;
    }

    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    if (!email || !password) {
      this.logger.warn(
        'No hay ningún admin. Define admin y password en el .env',
      );
      return;
    }

    if (await this.findByEmail(email)) {
      this.logger.warn(
        `El usuario administrador con correo ${email} ya existe.`,
      );
      return;
    }

    await this.create(
      { name: 'Admin', lastName: 'Principal', email, password },
      Role.Admin,
    );
    this.logger.log(`Admin creado: ${email}`);
  }

  async create(createUserDto: CreateUserDto, role: Role = Role.Cliente) {
    await this.checkEmailIsFree(createUserDto.email);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  // ---------- Perfil del cliente ----------

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.findOne(id);
    return await this.applyChanges(user, updateProfileDto);
  }

  // ---------- Gestión de empleados (admin) ----------

  async findEmployees() {
    return await this.usersRepository.findBy({ role: In(EMPLOYEE_ROLES) });
  }

  async findEmployee(id: number) {
    const employee = await this.usersRepository.findOneBy({
      id,
      role: In(EMPLOYEE_ROLES),
    });
    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }
    return employee;
  }

  async updateEmployee(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    currentUserId: number,
  ) {
    const employee = await this.findEmployee(id);
    if (
      id === currentUserId &&
      updateEmployeeDto.role &&
      updateEmployeeDto.role !== Role.Admin
    ) {
      throw new BadRequestException(
        'No puedes quitarte el rol de administrador',
      );
    }
    return await this.applyChanges(employee, updateEmployeeDto);
  }

  async removeEmployee(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new BadRequestException('No puedes eliminar tu propia cuenta');
    }
    const employee = await this.findEmployee(id);
    await this.usersRepository.remove(employee);
    return { message: 'Empleado eliminado' };
  }

  // ---------- Ayudantes privados ----------

  private async applyChanges(
    user: User,
    changes: UpdateProfileDto | UpdateEmployeeDto,
  ) {
    if (changes.email && changes.email !== user.email) {
      await this.checkEmailIsFree(changes.email);
    }
    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 10);
    }
    // Solo se copian los campos que llegaron. Los que no se enviaron vienen como
    // undefined y, si se copiaran, la respuesta los mostraría vacíos
    const sentFields = Object.entries(changes).filter(
      ([, value]) => value !== undefined,
    );
    Object.assign(user, Object.fromEntries(sentFields));
    return await this.usersRepository.save(user);
  }

  private async checkEmailIsFree(email: string) {
    if (await this.findByEmail(email)) {
      throw new ConflictException('Ya existe una cuenta con ese email');
    }
  }
}
