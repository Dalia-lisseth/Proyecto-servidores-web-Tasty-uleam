import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../services/authService';
import '../styles/tasty.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Normalizar valores antes de enviar
    const emailNormalizado = email.trim();
    const passwordNormalizado = password.trim();

    if (!emailNormalizado || !passwordNormalizado) {
      alert('Por favor completa tus credenciales.');
      return;
    }

    console.log('AdminLogin - Enviando credenciales:', {
      email: emailNormalizado,
      emailLength: emailNormalizado.length,
      passwordLength: passwordNormalizado.length,
      password: passwordNormalizado
    });

    const resultado = loginAdmin(emailNormalizado, passwordNormalizado);
    console.log('AdminLogin - Resultado del login:', resultado);
    console.log('AdminLogin - sessionStorage después del login:', {
      adminLoggedIn: sessionStorage.getItem('adminLoggedIn'),
      adminEmail: sessionStorage.getItem('adminEmail')
    });

    if (resultado) {
      // Pequeño delay para asegurar que sessionStorage se guarde
      setTimeout(() => {
        navigate('/admin/panel');
      }, 100);
    } else {
      alert('Credenciales de administrador inválidas.\n\nCredenciales de prueba:\nEmail: admin@tastyuleam.com\nContraseña: admin123');
    }
  };

  return (
    <main className="login-page">
      <div className="container">
        <div className="login-card admin-login-card">
          <div className="login-brand">
            <div className="logo">Tasty Uleam</div>
            <p className="muted">Panel de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="adminEmail">Correo electrónico</label>
              <input
                id="adminEmail"
                type="email"
                placeholder="admin@tastyuleam.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="adminPassword">Contraseña</label>
              <input
                id="adminPassword"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary login-submit">
              Iniciar Sesión
            </button>
          </form>

          <div className="login-foot">
            <Link to="/" className="link-muted">
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
