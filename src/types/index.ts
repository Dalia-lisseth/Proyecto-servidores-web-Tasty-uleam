// Tipos para usuarios
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  fechaNacimiento?: string;
  newsletter?: boolean;
  fechaRegistro: string;
  activo: boolean;
}

// Tipos para menú
export interface MenuItem {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  sede: string;
  descripcion: string;
  ingredientes?: string;
  imagen?: string;
}

// Tipos para pedidos
export interface PedidoItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  sede: string;
  items: PedidoItem[];
  total: number;
  estado: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
  cliente: string;
}

// Tipos para reservas
export interface Reserva {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaReserva: string;
  horaReserva: string;
  personas: number;
  sede: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  fechaCreacion: string;
}

// Tipos para carrito
export interface CarritoItem extends MenuItem {
  cantidad: number;
}
