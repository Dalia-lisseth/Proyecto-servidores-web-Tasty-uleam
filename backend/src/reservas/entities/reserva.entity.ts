import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export const ESTADOS_RESERVA = [
  'pendiente',
  'confirmada',
  'cancelada',
] as const;

export type EstadoReserva = (typeof ESTADOS_RESERVA)[number];

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column({ type: 'date' })
  fechaReserva: string;

  @Column()
  sede: string;

  @Column({ default: 'pendiente' })
  estado: EstadoReserva;

  @ManyToOne(() => Usuario, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: Usuario;

  @Column({ nullable: true })
  usuarioId?: number;
}