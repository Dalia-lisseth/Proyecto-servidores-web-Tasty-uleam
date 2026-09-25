import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    // 1. Carga las variables de entorno de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. Configura TypeORM asíncronamente para leer del ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Carga automáticamente las entidades registradas
        synchronize: true, // Sincroniza la estructura de la BD (ideal para desarrollo)
      }),
    }),

    MenuModule,
    UsuariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}