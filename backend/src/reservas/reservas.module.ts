import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { Reserva } from './entities/reserva.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Usuario])],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}