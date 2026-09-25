import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iniciarSesion, loginAdmin } from '../services/authService';
import '../styles/tasty.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const rememberEmail = localStorage.getItem('rememberEmail');
    if (rememberEmail) {
      setEmail(rememberEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Por favor completa tus credenciales.');
      return;
    }

    // Normalizar valores
    const emailNormalizado = email.trim();
    const passwordNormalizado = password.trim();

    // Primero intentar como administrador
    const esAdmin = loginAdmin(emailNormalizado, passwordNormalizado);
    
    if (esAdmin) {
      console.log('Login exitoso como administrador');
      // Pequeño delay para asegurar que sessionStorage se guarde
      setTimeout(() => {
        navigate('/admin/panel');
      }, 100);
      return;
    }

    // Si no es admin, intentar como usuario normal
    console.log('Intentando login como usuario normal...');
    const resultado = await iniciarSesion(emailNormalizado, passwordNormalizado);

    if (resultado.success) {
      if (remember) {
        localStorage.setItem('rememberEmail', emailNormalizado);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      navigate('/');
    } else {
      alert(resultado.error || 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.');
    }
  };

  return (
    <main className="login-page">
      <div className="container">
        <div className="login-card">
          <div className="login-brand">
            <div className="logo">Tasty Uleam</div>
            <p className="muted">Bienvenido — ingresa para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  👁
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{' '}
                Recuérdame
              </label>
            </div>

            <button type="submit" className="btn-primary login-submit">
              Iniciar sesión
            </button>
          </form>

          <div className="login-foot">
            <p className="muted">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
