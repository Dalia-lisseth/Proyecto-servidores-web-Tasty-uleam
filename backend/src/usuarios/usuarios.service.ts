import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

type UsuarioPublico = Omit<Usuario, 'password'>;

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioPublico> {
    const { confirmPassword, password, ...datosUsuario } = createUsuarioDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const email = datosUsuario.email.toLowerCase();
    const usuarioExistente = await this.usuariosRepository.findOneBy({ email });

    if (usuarioExistente) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const usuario = this.usuariosRepository.create({
      ...datosUsuario,
      email,
      password: await bcrypt.hash(password, 10),
    });

    return this.toPublic(await this.usuariosRepository.save(usuario));
  }

  async findAll(): Promise<UsuarioPublico[]> {
    const usuarios = await this.usuariosRepository.find({
      order: { id: 'ASC' },
    });

    return usuarios.map((usuario) => this.toPublic(usuario));
  }

  async login(loginUsuarioDto: LoginUsuarioDto) {
    const email = loginUsuarioDto.email.toLowerCase();
    const usuario = await this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email })
      .getOne();

    if (!usuario || !(await bcrypt.compare(loginUsuarioDto.password, usuario.password))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('La cuenta está desactivada');
    }

    return {
      message: 'Inicio de sesión exitoso',
      usuario: this.toPublic(usuario),
    };
  }

  async findOne(id: number): Promise<UsuarioPublico> {
    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.toPublic(usuario);
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioPublico> {
    const { confirmPassword, password, email, ...datosUsuario } =
      updateUsuarioDto;

    if (password !== undefined && password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const datosActualizados: Partial<Usuario> = {
      ...datosUsuario,
      ...(email ? { email: email.toLowerCase() } : {}),
      ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
    };

    const usuario = await this.usuariosRepository.preload({
      id,
      ...datosActualizados,
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.toPublic(await this.usuariosRepository.save(usuario));
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuariosRepository.remove(usuario);
  }

  private toPublic(usuario: Usuario): UsuarioPublico {
    const { password: _password, ...usuarioPublico } = usuario;

    return usuarioPublico;
  }
}