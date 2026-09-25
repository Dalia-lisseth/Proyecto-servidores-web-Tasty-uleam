import { Link, useLocation, useNavigate } from 'react-router-dom';
import { estaLogueado, obtenerUsuarioActual, cerrarSesion } from '../services/authService';
import { useState, useEffect } from 'react';
import '../styles/tasty.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = estaLogueado();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const user = obtenerUsuarioActual();
        if (user) {
          setUserName(user.nombre);
        }
      }
    };

    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [location]);

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      cerrarSesion();
      setIsLoggedIn(false);
      setUserName('');
      navigate('/');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="main-header">
      <div className="container header-inner">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Tasty Uleam
        </div>
        <nav className="navbar">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            INICIO
          </Link>
          <Link to="/registro" className={isActive('/registro') ? 'active' : ''}>
            REGÍSTRATE
          </Link>
          {!isLoggedIn ? (
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>
              INICIAR SESIÓN
            </Link>
          ) : (
            <div style={{ position: 'relative' }}>
              <span
                id="userMenu"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ cursor: 'pointer' }}
              >
                {userName} ▼
              </span>
              {showUserMenu && (
                <div className="user-menu-dropdown show">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Función de perfil próximamente disponible'); setShowUserMenu(false); }}>
                    Mi Perfil
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Función de pedidos próximamente disponible'); setShowUserMenu(false); }}>
                    Mis Pedidos
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Función de reservas próximamente disponible'); setShowUserMenu(false); }}>
                    Mis Reservas
                  </a>
                  <div className="divider"></div>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setShowUserMenu(false); }}>
                    Cerrar Sesión
                  </a>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
