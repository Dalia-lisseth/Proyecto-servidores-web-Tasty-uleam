import type { Reserva } from '../types';

// Obtener reservas
export const obtenerReservas = (): Reserva[] => {
  const reservas = localStorage.getItem('reservas');
  return reservas ? JSON.parse(reservas) : [];
};

// Guardar reservas
export const guardarReservas = (reservas: Reserva[]): void => {
  localStorage.setItem('reservas', JSON.stringify(reservas));
};

// Crear nueva reserva
export interface ReservaDatos {
  nombre: string;
  email: string;
  telefono: string;
  fechaReserva: string;
  horaReserva: string;
  personas: number;
  sede: string;
}

export const crearReserva = (datos: ReservaDatos): Reserva => {
  const reservas = obtenerReservas();
  
  const nuevaReserva: Reserva = {
    id: reservas.length > 0 ? Math.max(...reservas.map(r => r.id)) + 1 : 1,
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono,
    fechaReserva: datos.fechaReserva,
    horaReserva: datos.horaReserva,
    personas: datos.personas,
    sede: datos.sede,
    estado: 'pendiente',
    fechaCreacion: new Date().toISOString()
  };
  
  reservas.push(nuevaReserva);
  guardarReservas(reservas);
  return nuevaReserva;
};

// Actualizar estado de reserva
export const actualizarEstadoReserva = (id: number, estado: Reserva['estado']): void => {
  const reservas = obtenerReservas();
  const reserva = reservas.find(r => r.id === id);
  if (reserva) {
    reserva.estado = estado;
    guardarReservas(reservas);
  }
};

// Eliminar reserva
export const eliminarReserva = (id: number): void => {
  const reservas = obtenerReservas();
  const nuevasReservas = reservas.filter(r => r.id !== id);
  guardarReservas(nuevasReservas);
};
