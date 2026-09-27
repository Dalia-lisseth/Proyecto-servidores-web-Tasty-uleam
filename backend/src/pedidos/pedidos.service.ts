import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MenuItem } from '../menu/entities/menu-item.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Pedido } from './entities/pedido.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepository: Repository<Pedido>,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(MenuItem)
    private readonly menuRepository: Repository<MenuItem>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const { usuarioId, itemIds, estado, sede } = createPedidoDto;

    const usuario = await this.usuariosRepository.findOneBy({
      id: usuarioId,
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const items = await this.menuRepository.findBy({ id: In(itemIds) });

    if (items.length !== itemIds.length) {
      throw new NotFoundException('Uno o más productos del menú no existen');
    }

    const total = items.reduce((suma, item) => suma + Number(item.precio), 0);

    const pedido = this.pedidosRepository.create({
      sede,
      estado: estado ?? 'pendiente',
      fecha: new Date().toISOString().slice(0, 10),
      usuario,
      usuarioId: usuario.id,
      items,
      total,
    });

    return this.pedidosRepository.save(pedido);
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidosRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOneBy({ id });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  async update(
    id: number,
    updatePedidoDto: UpdatePedidoDto,
  ): Promise<Pedido> {
    const pedido = await this.findOne(id);
    const { usuarioId, itemIds, estado, sede } = updatePedidoDto;

    if (usuarioId !== undefined) {
      const usuario = await this.usuariosRepository.findOneBy({
        id: usuarioId,
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      pedido.usuario = usuario;
      pedido.usuarioId = usuario.id;
    }

    if (itemIds !== undefined) {
      const items = await this.menuRepository.findBy({ id: In(itemIds) });

      if (items.length !== itemIds.length) {
        throw new NotFoundException(
          'Uno o más productos del menú no existen',
        );
      }

      pedido.items = items;
      pedido.total = items.reduce(
        (suma, item) => suma + Number(item.precio),
        0,
      );
    }

    if (sede !== undefined) {
      pedido.sede = sede;
    }

    if (estado !== undefined) {
      pedido.estado = estado;
    }

    return this.pedidosRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);

    await this.pedidosRepository.remove(pedido);
  }
}