import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ESTADOS_RESERVA } from '../entities/reserva.entity';
import type { EstadoReserva } from '../entities/reserva.entity';

export class CreateReservaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsDateString()
  fechaReserva: string;

  @IsString()
  @IsNotEmpty()
  sede: string;

  @IsOptional()
  @IsIn(ESTADOS_RESERVA)
  estado?: EstadoReserva;

  @IsOptional()
  @IsInt()
  @IsPositive()
  usuarioId?: number;
}