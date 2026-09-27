import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservasRepository: Repository<Reserva>,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    const { usuarioId, estado, ...datosReserva } = createReservaDto;

    let usuario: Usuario | undefined;

    if (usuarioId !== undefined) {
      const usuarioEncontrado = await this.usuariosRepository.findOneBy({
        id: usuarioId,
      });

      if (!usuarioEncontrado) {
        throw new NotFoundException('Usuario no encontrado');
      }

      usuario = usuarioEncontrado;
    }

    const reserva = this.reservasRepository.create({
      ...datosReserva,
      estado: estado ?? 'pendiente',
      ...(usuario ? { usuario, usuarioId: usuario.id } : {}),
    });

    return this.reservasRepository.save(reserva);
  }

  async findAll(): Promise<Reserva[]> {
    return this.reservasRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservasRepository.findOneBy({ id });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return reserva;
  }

  async update(
    id: number,
    updateReservaDto: UpdateReservaDto,
  ): Promise<Reserva> {
    const reserva = await this.findOne(id);
    const { usuarioId, ...datosReserva } = updateReservaDto;

    if (usuarioId !== undefined) {
      const usuario = await this.usuariosRepository.findOneBy({
        id: usuarioId,
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      reserva.usuario = usuario;
      reserva.usuarioId = usuario.id;
    }

    Object.assign(reserva, datosReserva);

    return this.reservasRepository.save(reserva);
  }

  async remove(id: number): Promise<void> {
    const reserva = await this.findOne(id);

    await this.reservasRepository.remove(reserva);
  }
}