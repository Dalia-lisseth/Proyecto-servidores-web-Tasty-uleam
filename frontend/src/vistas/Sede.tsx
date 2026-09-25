import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../componets/Header';
import { obtenerMenuPorSede, inicializarMenu } from '../services/menuService';
import { crearPedido } from '../services/pedidoService';
import { crearReserva } from '../services/reservaService';
import type { ReservaDatos } from '../services/reservaService';
import { obtenerUsuarioActual } from '../services/authService';
import type { MenuItem, CarritoItem } from '../types';
import tastyCentralImg from '../assets/Tastycentral.jpg';
import tastyExpressImg from '../assets/tastyexpress.jpg';
import tastyComedorImg from '../assets/Tastycomedor.jpg';
import '../styles/tasty.css';

const SEDE_CONFIG: Record<string, { nombre: string; imagen: string; descripcion: string; menuDefault: MenuItem[] }> = {
  'tasty-central': {
    nombre: 'Tasty Central',
    imagen: tastyCentralImg,
    descripcion: 'El corazón de la universidad te espera con los mejores sabores',
    menuDefault: [
      { id: 1, nombre: 'Hamburguesa Clásica', precio: 5.50, categoria: 'Platos Principales', sede: 'Tasty Central', descripcion: 'Jugosa hamburguesa con carne 100% res, lechuga, tomate, cebolla y nuestra salsa especial.', ingredientes: 'Carne de res, pan artesanal, lechuga, tomate, cebolla, queso, salsa especial', imagen: '' },
      { id: 2, nombre: 'Pizza Margarita', precio: 6.00, categoria: 'Platos Principales', sede: 'Tasty Central', descripcion: 'Pizza tradicional italiana con tomate, mozzarella fresca y albahaca.', ingredientes: 'Masa artesanal, salsa de tomate, mozzarella, albahaca fresca', imagen: '' },
      { id: 3, nombre: 'Ensalada César', precio: 4.50, categoria: 'Ensaladas', sede: 'Tasty Central', descripcion: 'Fresca ensalada con lechuga romana, crutones, parmesano y aderezo césar casero.', ingredientes: 'Lechuga romana, crutones, queso parmesano, aderezo césar', imagen: '' },
      { id: 4, nombre: 'Sandwich de Pollo', precio: 4.00, categoria: 'Platos Principales', sede: 'Tasty Central', descripcion: 'Sandwich de pollo a la plancha con vegetales frescos y mayonesa.', ingredientes: 'Pechuga de pollo, pan integral, lechuga, tomate, mayonesa', imagen: '' },
      { id: 5, nombre: 'Sopa del Día', precio: 3.50, categoria: 'Sopas', sede: 'Tasty Central', descripcion: 'Sopa casera preparada diariamente con ingredientes frescos.', ingredientes: 'Varía según el día', imagen: '' },
      { id: 6, nombre: 'Jugo Natural', precio: 2.00, categoria: 'Bebidas', sede: 'Tasty Central', descripcion: 'Jugo natural de frutas frescas de temporada.', ingredientes: 'Frutas frescas de temporada', imagen: '' },
      { id: 7, nombre: 'Café Americano', precio: 1.50, categoria: 'Bebidas', sede: 'Tasty Central', descripcion: 'Café americano recién preparado, caliente y aromático.', ingredientes: 'Café 100% arábica', imagen: '' },
      { id: 8, nombre: 'Postre del Día', precio: 3.00, categoria: 'Postres', sede: 'Tasty Central', descripcion: 'Postre casero preparado diariamente por nuestro chef.', ingredientes: 'Varía según el día', imagen: '' }
    ]
  },
  'tasty-express': {
    nombre: 'Tasty Express',
    imagen: tastyExpressImg,
    descripcion: 'Comida rápida y deliciosa para estudiantes con prisa',
    menuDefault: [
      { id: 1, nombre: 'Combo Express', precio: 5.00, categoria: 'Combos', sede: 'Tasty Express', descripcion: 'Combo completo con hamburguesa, papas fritas y bebida. Perfecto para estudiantes con prisa.', ingredientes: 'Hamburguesa, papas fritas, bebida a elección', imagen: '' },
      { id: 2, nombre: 'Hot Dog', precio: 3.50, categoria: 'Platos Principales', sede: 'Tasty Express', descripcion: 'Hot dog clásico con salchicha premium, cebolla, tomate y salsas.', ingredientes: 'Salchicha premium, pan, cebolla, tomate, mostaza, ketchup', imagen: '' },
      { id: 3, nombre: 'Nachos con Queso', precio: 4.00, categoria: 'Aperitivos', sede: 'Tasty Express', descripcion: 'Nachos crujientes bañados en queso derretido y jalapeños.', ingredientes: 'Nachos, queso cheddar, jalapeños', imagen: '' },
      { id: 4, nombre: 'Wrap de Pollo', precio: 4.50, categoria: 'Platos Principales', sede: 'Tasty Express', descripcion: 'Wrap de pollo a la plancha con vegetales frescos y aderezo especial.', ingredientes: 'Pechuga de pollo, tortilla de harina, lechuga, tomate, aderezo', imagen: '' },
      { id: 5, nombre: 'Papas Fritas', precio: 2.50, categoria: 'Acompañamientos', sede: 'Tasty Express', descripcion: 'Papas fritas crujientes y doradas, perfectas como acompañamiento.', ingredientes: 'Papas, aceite, sal', imagen: '' },
      { id: 6, nombre: 'Refresco', precio: 1.50, categoria: 'Bebidas', sede: 'Tasty Express', descripcion: 'Refresco frío de tu sabor favorito.', ingredientes: 'Refresco de cola, naranja o limón', imagen: '' },
      { id: 7, nombre: 'Café Express', precio: 1.80, categoria: 'Bebidas', sede: 'Tasty Express', descripcion: 'Café expresso intenso y energizante, ideal para estudiar.', ingredientes: 'Café expresso', imagen: '' },
      { id: 8, nombre: 'Brownie', precio: 2.50, categoria: 'Postres', sede: 'Tasty Express', descripcion: 'Brownie de chocolate casero, húmedo y delicioso.', ingredientes: 'Chocolate, harina, huevos, mantequilla', imagen: '' }
    ]
  },
  'tasty-comedor': {
    nombre: 'Tasty Comedor',
    imagen: tastyComedorImg,
    descripcion: 'Platos tradicionales y caseros para toda la comunidad universitaria',
    menuDefault: [
      { id: 1, nombre: 'Arroz con Pollo', precio: 4.50, categoria: 'Platos Principales', sede: 'Tasty Comedor', descripcion: 'Tradicional arroz con pollo ecuatoriano, preparado con receta casera y mucho sabor.', ingredientes: 'Arroz, pollo, cebolla, ajo, pimiento, comino, achiote', imagen: '' },
      { id: 2, nombre: 'Seco de Carne', precio: 5.00, categoria: 'Platos Principales', sede: 'Tasty Comedor', descripcion: 'Seco de carne guisado con cerveza, servido con arroz, menestra y plátano maduro.', ingredientes: 'Carne de res, cerveza, cebolla, ajo, comino, arroz, menestra, plátano', imagen: '' },
      { id: 3, nombre: 'Encebollado', precio: 4.00, categoria: 'Platos Principales', sede: 'Tasty Comedor', descripcion: 'Sopa tradicional ecuatoriana con pescado, yuca, cebolla y cilantro.', ingredientes: 'Pescado, yuca, cebolla colorada, cilantro, tomate, limón', imagen: '' },
      { id: 4, nombre: 'Ceviche', precio: 5.50, categoria: 'Platos Principales', sede: 'Tasty Comedor', descripcion: 'Fresco ceviche de pescado con cebolla, tomate, cilantro y limón.', ingredientes: 'Pescado fresco, cebolla, tomate, cilantro, limón, sal', imagen: '' },
      { id: 5, nombre: 'Caldo de Gallina', precio: 3.50, categoria: 'Sopas', sede: 'Tasty Comedor', descripcion: 'Caldo nutritivo de gallina criolla con verduras y fideos.', ingredientes: 'Gallina criolla, zanahoria, cebolla, fideos, cilantro', imagen: '' },
      { id: 6, nombre: 'Colada Morada', precio: 2.00, categoria: 'Bebidas', sede: 'Tasty Comedor', descripcion: 'Bebida tradicional ecuatoriana preparada con frutas y especias.', ingredientes: 'Mora, piña, naranjilla, canela, clavo de olor, harina de maíz', imagen: '' },
      { id: 7, nombre: 'Jugo de Naranja', precio: 1.50, categoria: 'Bebidas', sede: 'Tasty Comedor', descripcion: 'Jugo natural de naranja recién exprimido, rico en vitamina C.', ingredientes: 'Naranjas frescas', imagen: '' },
      { id: 8, nombre: 'Flan de Leche', precio: 2.50, categoria: 'Postres', sede: 'Tasty Comedor', descripcion: 'Flan casero de leche condensada, suave y cremoso.', ingredientes: 'Leche condensada, huevos, azúcar, vainilla', imagen: '' }
    ]
  }
};

export default function Sede() {
  const { sedeId } = useParams<{ sedeId: string }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<'menu' | 'reserva' | 'pedido'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [reservaForm, setReservaForm] = useState<ReservaDatos>({
    nombre: '',
    email: '',
    telefono: '',
    fechaReserva: '',
    horaReserva: '',
    personas: 1,
    sede: ''
  });

  const sedeConfig = sedeId ? SEDE_CONFIG[sedeId] : null;

  useEffect(() => {
    if (!sedeId || !sedeConfig) {
      navigate('/');
      return;
    }

    inicializarMenu();
    cargarMenu();

    // Verificar cambios en localStorage
    const interval = setInterval(() => {
      cargarMenu();
    }, 2000);

    return () => clearInterval(interval);
  }, [sedeId]);

  const cargarMenu = () => {
    if (!sedeConfig) return;

    const menuAdmin = obtenerMenuPorSede(sedeConfig.nombre);
    if (menuAdmin.length > 0) {
      setMenuItems(menuAdmin);
    } else {
      setMenuItems(sedeConfig.menuDefault);
    }
  };

  const agregarAlCarrito = (itemId: number) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    setCarrito(prev => {
      const itemEnCarrito = prev.find(i => i.id === itemId);
      if (itemEnCarrito) {
        return prev.map(i =>
          i.id === itemId ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (itemId: number, cambio: number) => {
    setCarrito(prev => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;

      if (item.cantidad + cambio <= 0) {
        return prev.filter(i => i.id !== itemId);
      }

      return prev.map(i =>
        i.id === itemId ? { ...i, cantidad: i.cantidad + cambio } : i
      );
    });
  };

  const removerDelCarrito = (itemId: number) => {
    setCarrito(prev => prev.filter(i => i.id !== itemId));
  };

  const confirmarPedido = () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío. Agrega items antes de confirmar.');
      return;
    }

    if (!sedeConfig) return;

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const confirmacion = confirm(`¿Confirmar pedido por $${total.toFixed(2)}?`);

    if (confirmacion) {
      const usuario = obtenerUsuarioActual();
      const items = carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      }));

      crearPedido(items, sedeConfig.nombre, usuario?.nombre || 'Usuario');
      alert('¡Pedido confirmado! Te contactaremos pronto para coordinar la entrega.');
      setCarrito([]);
    }
  };

  const handleReservaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sedeConfig) return;

    const fechaReserva = new Date(reservaForm.fechaReserva);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      alert('Por favor selecciona una fecha válida.');
      return;
    }

    crearReserva({
      ...reservaForm,
      sede: sedeConfig.nombre
    });

    alert(
      `¡Reserva confirmada!\n\nNombre: ${reservaForm.nombre}\nFecha: ${reservaForm.fechaReserva}\nHora: ${reservaForm.horaReserva}\nPersonas: ${reservaForm.personas}\n\nTe enviaremos un correo de confirmación a ${reservaForm.email}`
    );

    setReservaForm({
      nombre: '',
      email: '',
      telefono: '',
      fechaReserva: '',
      horaReserva: '',
      personas: 1,
      sede: ''
    });
  };

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  if (!sedeConfig) return null;

  const categorias = Array.from(new Set(menuItems.map(item => item.categoria)));
  const menuAgrupado = categorias.reduce((acc, categoria) => {
    acc[categoria] = menuItems.filter(item => item.categoria === categoria);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <Header />
      <section className="sede-hero">
        <div className="sede-banner">
          <img src={sedeConfig.imagen} alt={sedeConfig.nombre} />
          <div className="sede-overlay">
            <h1>{sedeConfig.nombre}</h1>
            <p>{sedeConfig.descripcion}</p>
          </div>
        </div>
      </section>

      <main className="content">
        <div className="container">
          <div className="sede-actions">
            <button className="btn-primary btn-action" onClick={() => setSection('reserva')}>
              Reservar Mesa
            </button>
            <button className="btn-primary btn-action" onClick={() => setSection('pedido')}>
              Realizar Pedido
            </button>
            <button className="btn-outline btn-action" onClick={cargarMenu} title="Actualizar menú">
              🔄 Actualizar Menú
            </button>
          </div>

          {section === 'menu' && (
            <section className="menu-section">
              <h2 className="section-title">Menú de {sedeConfig.nombre}</h2>
              <div className="menu-grid">
                {categorias.map(categoria => (
                  <div key={categoria} className="categoria-section">
                    <h3 className="categoria-title">{categoria}</h3>
                    <div className="menu-items-grid">
                      {menuAgrupado[categoria].map(item => (
                        <div key={item.id} className="menu-item-card">
                          <div className="menu-item-image">
                            {item.imagen ? (
                              <img src={item.imagen} alt={item.nombre} onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const placeholder = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }} />
                            ) : (
                              <div className="image-placeholder">
                                <span>
                                  📷 Imagen no disponible
                                  <small>El administrador puede cargar una imagen aquí</small>
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="menu-item-content">
                            <div className="menu-item-header">
                              <h4>{item.nombre}</h4>
                              <p className="menu-item-precio">${item.precio.toFixed(2)}</p>
                            </div>
                            <p className="menu-item-categoria">{item.categoria}</p>
                            <p className="menu-item-descripcion">{item.descripcion}</p>
                            {item.ingredientes && (
                              <p className="menu-item-ingredientes">
                                <strong>Ingredientes:</strong> {item.ingredientes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {section === 'reserva' && (
            <section className="reserva-section">
              <h2 className="section-title">Reservar Mesa</h2>
              <div className="form-container">
                <form onSubmit={handleReservaSubmit} className="reserva-form">
                  <div className="form-group">
                    <label htmlFor="nombreReserva">Nombre completo</label>
                    <input
                      type="text"
                      id="nombreReserva"
                      value={reservaForm.nombre}
                      onChange={(e) => setReservaForm({ ...reservaForm, nombre: e.target.value })}
                      required
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="emailReserva">Correo electrónico</label>
                    <input
                      type="email"
                      id="emailReserva"
                      value={reservaForm.email}
                      onChange={(e) => setReservaForm({ ...reservaForm, email: e.target.value })}
                      required
                      placeholder="tu@correo.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefonoReserva">Teléfono</label>
                    <input
                      type="tel"
                      id="telefonoReserva"
                      value={reservaForm.telefono}
                      onChange={(e) => setReservaForm({ ...reservaForm, telefono: e.target.value })}
                      required
                      placeholder="0999999999"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fechaReserva">Fecha</label>
                    <input
                      type="date"
                      id="fechaReserva"
                      min={maxDate}
                      value={reservaForm.fechaReserva}
                      onChange={(e) => setReservaForm({ ...reservaForm, fechaReserva: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="horaReserva">Hora</label>
                    <input
                      type="time"
                      id="horaReserva"
                      value={reservaForm.horaReserva}
                      onChange={(e) => setReservaForm({ ...reservaForm, horaReserva: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="personasReserva">Número de personas</label>
                    <input
                      type="number"
                      id="personasReserva"
                      min="1"
                      max="10"
                      value={reservaForm.personas}
                      onChange={(e) => setReservaForm({ ...reservaForm, personas: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    Confirmar Reserva
                  </button>
                </form>
              </div>
            </section>
          )}

          {section === 'pedido' && (
            <section className="pedido-section">
              <h2 className="section-title">Realizar Pedido</h2>
              <div className="pedido-container">
                <div className="menu-pedido">
                  <div className="menu-grid">
                    {categorias.map(categoria => (
                      <div key={categoria} className="categoria-section">
                        <h3 className="categoria-title">{categoria}</h3>
                        <div className="menu-items-grid">
                          {menuAgrupado[categoria].map(item => (
                            <div key={item.id} className="menu-item-card">
                              <div className="menu-item-image">
                                {item.imagen ? (
                                  <img src={item.imagen} alt={item.nombre} />
                                ) : (
                                  <div className="image-placeholder">
                                    <span>📷 Imagen no disponible</span>
                                  </div>
                                )}
                              </div>
                              <div className="menu-item-content">
                                <div className="menu-item-header">
                                  <h4>{item.nombre}</h4>
                                  <p className="menu-item-precio">${item.precio.toFixed(2)}</p>
                                </div>
                                <p className="menu-item-categoria">{item.categoria}</p>
                                <p className="menu-item-descripcion">{item.descripcion}</p>
                                <button
                                  className="btn-add-cart"
                                  onClick={() => agregarAlCarrito(item.id)}
                                >
                                  Agregar al Pedido
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="carrito-container">
                  <h3>Tu Pedido</h3>
                  <div className="carrito">
                    {carrito.length === 0 ? (
                      <p className="carrito-vacio">Tu carrito está vacío</p>
                    ) : (
                      carrito.map(item => (
                        <div key={item.id} className="carrito-item">
                          <div className="carrito-item-info">
                            <h4>{item.nombre}</h4>
                            <p>${item.precio.toFixed(2)} x {item.cantidad}</p>
                          </div>
                          <div className="carrito-item-controls">
                            <button
                              className="btn-cantidad"
                              onClick={() => actualizarCantidad(item.id, -1)}
                            >
                              -
                            </button>
                            <span>{item.cantidad}</span>
                            <button
                              className="btn-cantidad"
                              onClick={() => actualizarCantidad(item.id, 1)}
                            >
                              +
                            </button>
                            <button
                              className="btn-remove"
                              onClick={() => removerDelCarrito(item.id)}
                            >
                              ×
                            </button>
                          </div>
                          <div className="carrito-item-subtotal">
                            <p>${(item.precio * item.cantidad).toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="carrito-total">
                    <p>Total: ${total.toFixed(2)}</p>
                    <button className="btn-primary" onClick={confirmarPedido}>
                      Confirmar Pedido
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
