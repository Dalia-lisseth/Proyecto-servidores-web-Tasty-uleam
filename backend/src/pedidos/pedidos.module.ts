import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Pedido } from './entities/pedido.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MenuItem } from '../menu/entities/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Usuario, MenuItem]), AuthModule],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
