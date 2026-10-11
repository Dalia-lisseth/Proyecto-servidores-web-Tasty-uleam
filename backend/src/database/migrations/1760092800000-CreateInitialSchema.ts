import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateInitialSchema1760092800000 implements MigrationInterface {
  name = 'CreateInitialSchema1760092800000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuarios',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          { name: 'nombre', type: 'varchar' },
          { name: 'apellido', type: 'varchar' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'telefono', type: 'varchar' },
          { name: 'password', type: 'varchar' },
          { name: 'fechaNacimiento', type: 'date', isNullable: true },
          { name: 'newsletter', type: 'boolean', default: false },
          {
            name: 'fechaRegistro',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'activo', type: 'boolean', default: true },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'menu_items',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          { name: 'nombre', type: 'varchar' },
          { name: 'precio', type: 'numeric', precision: 10, scale: 2 },
          { name: 'categoria', type: 'varchar' },
          { name: 'sede', type: 'varchar' },
          { name: 'descripcion', type: 'text' },
          { name: 'ingredientes', type: 'varchar', isNullable: true },
          { name: 'imagen', type: 'varchar', isNullable: true },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'pedidos',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          { name: 'fecha', type: 'date' },
          { name: 'sede', type: 'varchar' },
          {
            name: 'total',
            type: 'numeric',
            precision: 10,
            scale: 2,
            default: 0,
          },
          { name: 'estado', type: 'varchar', default: "'pendiente'" },
          { name: 'usuarioId', type: 'integer' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'pedidos',
      new TableForeignKey({
        name: 'FK_pedidos_usuario',
        columnNames: ['usuarioId'],
        referencedTableName: 'usuarios',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'reservas',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          { name: 'nombre', type: 'varchar' },
          { name: 'email', type: 'varchar' },
          { name: 'fechaReserva', type: 'date' },
          { name: 'sede', type: 'varchar' },
          { name: 'estado', type: 'varchar', default: "'pendiente'" },
          { name: 'usuarioId', type: 'integer', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'reservas',
      new TableForeignKey({
        name: 'FK_reservas_usuario',
        columnNames: ['usuarioId'],
        referencedTableName: 'usuarios',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'pedido_items',
        columns: [
          { name: 'pedidoId', type: 'integer', isPrimary: true },
          { name: 'menuItemId', type: 'integer', isPrimary: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'pedido_items',
      new TableForeignKey({
        name: 'FK_pedido_items_pedido',
        columnNames: ['pedidoId'],
        referencedTableName: 'pedidos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'pedido_items',
      new TableForeignKey({
        name: 'FK_pedido_items_menu_item',
        columnNames: ['menuItemId'],
        referencedTableName: 'menu_items',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pedido_items');
    await queryRunner.dropTable('reservas');
    await queryRunner.dropTable('pedidos');
    await queryRunner.dropTable('menu_items');
    await queryRunner.dropTable('usuarios');
  }
}
