import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { MenuItem } from '../../menu/entities/menu-item.entity';

export const ESTADOS_PEDIDO = [
  'pendiente',
  'en preparacion',
  'listo',
  'entregado',
  'cancelado',
] as const;

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column()
  sede: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ default: 'pendiente' })
  estado: EstadoPedido;

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column()
  usuarioId: number;

  @ManyToMany(() => MenuItem, { eager: true })
  @JoinTable({
    name: 'pedido_items',
    joinColumn: { name: 'pedidoId' },
    inverseJoinColumn: { name: 'menuItemId' },
  })
  items: MenuItem[];
}