import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ESTADOS_PEDIDO } from '../entities/pedido.entity';
import type { EstadoPedido } from '../entities/pedido.entity';

export class CreatePedidoDto {
  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsString()
  @IsNotEmpty()
  sede: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  itemIds: number[];

  @IsOptional()
  @IsIn(ESTADOS_PEDIDO)
  estado?: EstadoPedido;
}