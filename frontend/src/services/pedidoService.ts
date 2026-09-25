import type { Pedido, PedidoItem } from '../types';

// Obtener pedidos
export const obtenerPedidos = (): Pedido[] => {
  const pedidos = localStorage.getItem('pedidos');
  return pedidos ? JSON.parse(pedidos) : [];
};

// Guardar pedidos
export const guardarPedidos = (pedidos: Pedido[]): void => {
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
};

// Crear nuevo pedido
export const crearPedido = (
  items: PedidoItem[],
  sede: string,
  cliente: string
): Pedido => {
  const pedidos = obtenerPedidos();
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  const nuevoPedido: Pedido = {
    id: pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1,
    fecha: new Date().toISOString(),
    sede,
    items,
    total,
    estado: 'pendiente',
    cliente
  };
  
  pedidos.push(nuevoPedido);
  guardarPedidos(pedidos);
  return nuevoPedido;
};

// Actualizar estado de pedido
export const actualizarEstadoPedido = (id: number, estado: Pedido['estado']): void => {
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) {
    pedido.estado = estado;
    guardarPedidos(pedidos);
  }
};
