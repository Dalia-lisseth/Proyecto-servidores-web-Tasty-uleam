import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificarAdminLogueado, cerrarSesionAdmin } from '../services/authService';
import { obtenerMenuItems, guardarMenuItems, inicializarMenu } from '../services/menuService';
import { obtenerPedidos, actualizarEstadoPedido } from '../services/pedidoService';
import { obtenerReservas, actualizarEstadoReserva, eliminarReserva } from '../services/reservaService';
import type { MenuItem, Pedido, Reserva } from '../types';
import '../styles/tasty.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'menu' | 'pedidos' | 'reservas' | 'sedes'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState({
    sede: '',
    categoria: '',
    search: '',
    estadoPedido: '',
    sedePedido: '',
    estadoReserva: '',
    fechaReserva: ''
  });

  useEffect(() => {
    if (!verificarAdminLogueado()) {
      navigate('/login');
      return;
    }

    inicializarMenu();
    cargarDatos();

    const interval = setInterval(() => {
      cargarDatos();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const cargarDatos = () => {
    setMenuItems(obtenerMenuItems());
    setPedidos(obtenerPedidos());
    setReservas(obtenerReservas());
  };

  const handleCerrarSesion = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      cerrarSesionAdmin();
      navigate('/login');
    }
  };

  const handleGuardarItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const itemData: Partial<MenuItem> = {
      nombre: formData.get('nombre') as string,
      sede: formData.get('sede') as string,
      categoria: formData.get('categoria') as string,
      precio: parseFloat(formData.get('precio') as string),
      descripcion: formData.get('descripcion') as string,
      ingredientes: formData.get('ingredientes') as string || '',
      imagen: formData.get('imagen') as string || ''
    };

    const items = obtenerMenuItems();
    if (editingItem) {
      const index = items.findIndex(i => i.id === editingItem.id);
      if (index !== -1) {
        items[index] = { ...items[index], ...itemData };
      }
    } else {
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
      items.push({ id: newId, ...itemData } as MenuItem);
    }

    guardarMenuItems(items);
    setMenuItems(items);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleEditarItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleEliminarItem = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este item del menú?')) {
      const items = menuItems.filter(item => item.id !== id);
      guardarMenuItems(items);
      setMenuItems(items);
    }
  };

  const handleActualizarEstadoPedido = (id: number, estado: Pedido['estado']) => {
    actualizarEstadoPedido(id, estado);
    setPedidos(obtenerPedidos());
  };

  const handleActualizarEstadoReserva = (id: number, estado: Reserva['estado']) => {
    actualizarEstadoReserva(id, estado);
    setReservas(obtenerReservas());
  };

  const handleEliminarReserva = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      eliminarReserva(id);
      setReservas(obtenerReservas());
    }
  };

  const menuItemsFiltrados = menuItems.filter(item => {
    const matchSede = !filters.sede || item.sede === filters.sede;
    const matchCategoria = !filters.categoria || item.categoria === filters.categoria;
    const matchSearch = !filters.search || 
      item.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(filters.search.toLowerCase());
    return matchSede && matchCategoria && matchSearch;
  });

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchEstado = !filters.estadoPedido || pedido.estado === filters.estadoPedido;
    const matchSede = !filters.sedePedido || pedido.sede === filters.sedePedido;
    return matchEstado && matchSede;
  });

  const reservasFiltradas = reservas.filter(reserva => {
    const matchEstado = !filters.estadoReserva || reserva.estado === filters.estadoReserva;
    const matchFecha = !filters.fechaReserva || reserva.fechaReserva === filters.fechaReserva;
    return matchEstado && matchFecha;
  });

  const categorias = Array.from(new Set(menuItems.map(item => item.categoria)));
  const counts = {
    'Tasty Central': menuItems.filter(item => item.sede === 'Tasty Central').length,
    'Tasty Express': menuItems.filter(item => item.sede === 'Tasty Express').length,
    'Tasty Comedor': menuItems.filter(item => item.sede === 'Tasty Comedor').length
  };

  return (
    <div className="admin-body">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-logo">
            <h1>Tasty Uleam</h1>
            <span className="admin-subtitle">Panel de Administración</span>
          </div>
          <nav className="admin-nav">
            <button
              className={`admin-nav-btn ${activeSection === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveSection('menu')}
            >
              Menú
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'pedidos' ? 'active' : ''}`}
              onClick={() => setActiveSection('pedidos')}
            >
              Pedidos
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'reservas' ? 'active' : ''}`}
              onClick={() => setActiveSection('reservas')}
            >
              Reservas
            </button>
            <button
              className={`admin-nav-btn ${activeSection === 'sedes' ? 'active' : ''}`}
              onClick={() => setActiveSection('sedes')}
            >
              Sedes
            </button>
            <button className="btn-logout" onClick={handleCerrarSesion}>
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {activeSection === 'menu' && (
            <section className="admin-section active">
              <div className="section-header">
                <h2>Gestión de Menú</h2>
                <button className="btn-primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
                  + Agregar Item
                </button>
              </div>

              <div className="admin-filters">
                <select
                  className="admin-select"
                  value={filters.sede}
                  onChange={(e) => setFilters({ ...filters, sede: e.target.value })}
                >
                  <option value="">Todas las sedes</option>
                  <option value="Tasty Central">Tasty Central</option>
                  <option value="Tasty Express">Tasty Express</option>
                  <option value="Tasty Comedor">Tasty Comedor</option>
                </select>
                <select
                  className="admin-select"
                  value={filters.categoria}
                  onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Buscar en el menú..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div className="menu-admin-grid">
                {menuItemsFiltrados.length === 0 ? (
                  <p className="empty-state">No hay items en el menú. Agrega el primero haciendo clic en "Agregar Item".</p>
                ) : (
                  menuItemsFiltrados.map(item => (
                    <div key={item.id} className="menu-admin-card">
                      <div className="menu-admin-image">
                        {item.imagen ? (
                          <img src={item.imagen} alt={item.nombre} />
                        ) : (
                          <div className="image-placeholder">
                            <span>Sin imagen</span>
                          </div>
                        )}
                      </div>
                      <div className="menu-admin-info">
                        <h3>{item.nombre}</h3>
                        <div className="menu-admin-meta">
                          <span className="badge-sede">{item.sede}</span>
                          <span className="badge-categoria">{item.categoria}</span>
                          <span className="badge-precio">${item.precio.toFixed(2)}</span>
                        </div>
                        <p className="menu-admin-desc">{item.descripcion}</p>
                        <div className="menu-admin-actions">
                          <button className="btn-edit" onClick={() => handleEditarItem(item)}>
                            Editar
                          </button>
                          <button className="btn-delete" onClick={() => handleEliminarItem(item.id)}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {activeSection === 'pedidos' && (
            <section className="admin-section active">
              <div className="section-header">
                <h2>Gestión de Pedidos</h2>
                <button className="btn-primary" onClick={cargarDatos}>🔄 Actualizar</button>
              </div>

              <div className="admin-filters">
                <select
                  className="admin-select"
                  value={filters.estadoPedido}
                  onChange={(e) => setFilters({ ...filters, estadoPedido: e.target.value })}
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_preparacion">En Preparación</option>
                  <option value="listo">Listo</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <select
                  className="admin-select"
                  value={filters.sedePedido}
                  onChange={(e) => setFilters({ ...filters, sedePedido: e.target.value })}
                >
                  <option value="">Todas las sedes</option>
                  <option value="Tasty Central">Tasty Central</option>
                  <option value="Tasty Express">Tasty Express</option>
                  <option value="Tasty Comedor">Tasty Comedor</option>
                </select>
              </div>

              <div className="pedidos-list">
                {pedidosFiltrados.length === 0 ? (
                  <p className="empty-state">No hay pedidos registrados.</p>
                ) : (
                  pedidosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map(pedido => (
                    <div key={pedido.id} className={`pedido-card pedido-${pedido.estado}`}>
                      <div className="pedido-header">
                        <div>
                          <h3>Pedido #{pedido.id}</h3>
                          <p className="pedido-fecha">{new Date(pedido.fecha).toLocaleString('es-ES')}</p>
                        </div>
                        <select
                          className="estado-select"
                          value={pedido.estado}
                          onChange={(e) => handleActualizarEstadoPedido(pedido.id, e.target.value as Pedido['estado'])}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_preparacion">En Preparación</option>
                          <option value="listo">Listo</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                      <div className="pedido-body">
                        <div className="pedido-info">
                          <p><strong>Sede:</strong> {pedido.sede}</p>
                          <p><strong>Cliente:</strong> {pedido.cliente || 'No especificado'}</p>
                          <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
                        </div>
                        <div className="pedido-items">
                          <h4>Items:</h4>
                          <ul>
                            {pedido.items.map((item, idx) => (
                              <li key={idx}>
                                {item.nombre} x{item.cantidad} - ${(item.precio * item.cantidad).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {activeSection === 'reservas' && (
            <section className="admin-section active">
              <div className="section-header">
                <h2>Gestión de Reservas</h2>
                <button className="btn-primary" onClick={cargarDatos}>🔄 Actualizar</button>
              </div>

              <div className="admin-filters">
                <select
                  className="admin-select"
                  value={filters.estadoReserva}
                  onChange={(e) => setFilters({ ...filters, estadoReserva: e.target.value })}
                >
                  <option value="">Todas las reservas</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <input
                  type="date"
                  className="admin-input"
                  value={filters.fechaReserva}
                  onChange={(e) => setFilters({ ...filters, fechaReserva: e.target.value })}
                />
              </div>

              <div className="reservas-list">
                {reservasFiltradas.length === 0 ? (
                  <p className="empty-state">No hay reservas registradas.</p>
                ) : (
                  reservasFiltradas.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()).map(reserva => (
                    <div key={reserva.id} className={`reserva-card reserva-${reserva.estado}`}>
                      <div className="reserva-header">
                        <div>
                          <h3>Reserva #{reserva.id}</h3>
                          <p className="reserva-fecha">
                            {new Date(reserva.fechaReserva).toLocaleDateString('es-ES')} a las {reserva.horaReserva}
                          </p>
                        </div>
                        <select
                          className="estado-select"
                          value={reserva.estado}
                          onChange={(e) => handleActualizarEstadoReserva(reserva.id, e.target.value as Reserva['estado'])}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>
                      <div className="reserva-body">
                        <div className="reserva-info">
                          <p><strong>Nombre:</strong> {reserva.nombre}</p>
                          <p><strong>Email:</strong> {reserva.email}</p>
                          <p><strong>Teléfono:</strong> {reserva.telefono}</p>
                          <p><strong>Personas:</strong> {reserva.personas}</p>
                          <p><strong>Sede:</strong> {reserva.sede || 'No especificada'}</p>
                        </div>
                        <div className="reserva-actions">
                          <button className="btn-delete" onClick={() => handleEliminarReserva(reserva.id)}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {activeSection === 'sedes' && (
            <section className="admin-section active">
              <div className="section-header">
                <h2>Gestión de Sedes</h2>
              </div>
              <div className="sedes-admin-grid">
                <div className="sede-admin-card">
                  <h3>Tasty Central</h3>
                  <p>Menú: <span id="countCentral">{counts['Tasty Central']}</span> items</p>
                  <button className="btn-primary" onClick={() => { setActiveSection('menu'); setFilters({ ...filters, sede: 'Tasty Central' }); }}>
                    Gestionar Menú
                  </button>
                </div>
                <div className="sede-admin-card">
                  <h3>Tasty Express</h3>
                  <p>Menú: <span id="countExpress">{counts['Tasty Express']}</span> items</p>
                  <button className="btn-primary" onClick={() => { setActiveSection('menu'); setFilters({ ...filters, sede: 'Tasty Express' }); }}>
                    Gestionar Menú
                  </button>
                </div>
                <div className="sede-admin-card">
                  <h3>Tasty Comedor</h3>
                  <p>Menú: <span id="countComedor">{counts['Tasty Comedor']}</span> items</p>
                  <button className="btn-primary" onClick={() => { setActiveSection('menu'); setFilters({ ...filters, sede: 'Tasty Comedor' }); }}>
                    Gestionar Menú
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal show" onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setEditingItem(null); } }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Editar Item del Menú' : 'Agregar Item al Menú'}</h3>
              <button className="modal-close" onClick={() => { setShowModal(false); setEditingItem(null); }}>&times;</button>
            </div>
            <form onSubmit={handleGuardarItem} className="admin-form">
              <div className="form-group">
                <label htmlFor="menuNombre">Nombre del Plato *</label>
                <input
                  type="text"
                  id="menuNombre"
                  name="nombre"
                  defaultValue={editingItem?.nombre}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="menuSede">Sede *</label>
                  <select id="menuSede" name="sede" defaultValue={editingItem?.sede} required>
                    <option value="">Seleccionar sede</option>
                    <option value="Tasty Central">Tasty Central</option>
                    <option value="Tasty Express">Tasty Express</option>
                    <option value="Tasty Comedor">Tasty Comedor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="menuCategoria">Categoría *</label>
                  <input
                    type="text"
                    id="menuCategoria"
                    name="categoria"
                    defaultValue={editingItem?.categoria}
                    required
                    placeholder="Ej: Platos Principales"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="menuPrecio">Precio ($) *</label>
                  <input
                    type="number"
                    id="menuPrecio"
                    name="precio"
                    step="0.01"
                    min="0"
                    defaultValue={editingItem?.precio}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="menuImagen">URL de la Imagen</label>
                  <input
                    type="text"
                    id="menuImagen"
                    name="imagen"
                    defaultValue={editingItem?.imagen}
                    placeholder="../Imagenes/plato.jpg"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="menuDescripcion">Descripción *</label>
                <textarea
                  id="menuDescripcion"
                  name="descripcion"
                  rows={3}
                  defaultValue={editingItem?.descripcion}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="menuIngredientes">Ingredientes</label>
                <textarea
                  id="menuIngredientes"
                  name="ingredientes"
                  rows={2}
                  defaultValue={editingItem?.ingredientes}
                  placeholder="Separados por comas"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-outline" onClick={() => { setShowModal(false); setEditingItem(null); }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
