import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefono: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento?: string;

  @Column({ default: false })
  newsletter: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaRegistro: Date;

  @Column({ default: true })
  activo: boolean;
}