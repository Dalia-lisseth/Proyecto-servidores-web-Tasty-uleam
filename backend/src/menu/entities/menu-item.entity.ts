import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  categoria: string;

  @Column()
  sede: string;

  @Column('text')
  descripcion: string;

  @Column({ nullable: true })
  ingredientes?: string;

  @Column({ nullable: true })
  imagen?: string;
}