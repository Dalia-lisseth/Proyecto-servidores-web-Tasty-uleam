import type { MenuItem } from '../types';

// Obtener menú desde localStorage
export const obtenerMenuItems = (): MenuItem[] => {
  const menu = localStorage.getItem('menuItems');
  return menu ? JSON.parse(menu) : [];
};

// Guardar menú en localStorage
export const guardarMenuItems = (items: MenuItem[]): void => {
  localStorage.setItem('menuItems', JSON.stringify(items));
};

// Obtener menú por sede
export const obtenerMenuPorSede = (sede: string): MenuItem[] => {
  const items = obtenerMenuItems();
  return items.filter(item => item.sede === sede);
};

// Cargar menú de ejemplo si no existe
export const cargarMenusEjemplo = (): MenuItem[] => {
  const menusEjemplo: MenuItem[] = [
    { 
      id: 1, 
      nombre: 'Hamburguesa Clásica', 
      precio: 5.50, 
      categoria: 'Platos Principales', 
      sede: 'Tasty Central', 
      descripcion: 'Jugosa hamburguesa con carne 100% res', 
      ingredientes: 'Carne de res, pan artesanal, lechuga', 
      imagen: '' 
    },
    { 
      id: 2, 
      nombre: 'Pizza Margarita', 
      precio: 6.00, 
      categoria: 'Platos Principales', 
      sede: 'Tasty Central', 
      descripcion: 'Pizza tradicional italiana', 
      ingredientes: 'Masa artesanal, salsa de tomate', 
      imagen: '' 
    },
    { 
      id: 3, 
      nombre: 'Combo Express', 
      precio: 5.00, 
      categoria: 'Combos', 
      sede: 'Tasty Express', 
      descripcion: 'Combo completo con hamburguesa', 
      ingredientes: 'Hamburguesa, papas fritas', 
      imagen: '' 
    },
    { 
      id: 4, 
      nombre: 'Arroz con Pollo', 
      precio: 4.50, 
      categoria: 'Platos Principales', 
      sede: 'Tasty Comedor', 
      descripcion: 'Tradicional arroz con pollo ecuatoriano', 
      ingredientes: 'Arroz, pollo, cebolla', 
      imagen: '' 
    }
  ];
  
  guardarMenuItems(menusEjemplo);
  return menusEjemplo;
};

// Inicializar menú si está vacío
export const inicializarMenu = (): void => {
  const items = obtenerMenuItems();
  if (items.length === 0) {
    cargarMenusEjemplo();
  }
};
