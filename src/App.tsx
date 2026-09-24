import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './vistas/Inicio';
import Login from './vistas/Login';
import Registro from './vistas/Registro';
import Sede from './vistas/Sede';
import AdminPanel from './vistas/AdminPanel';
import { verificarAdminLogueado } from './services/authService';
import './styles/tasty.css';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  if (!verificarAdminLogueado()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/sede/:sedeId" element={<Sede />} />
        {/* Redirigir /admin/login a /login ya que ahora usan el mismo componente */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route
          path="/admin/panel"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
