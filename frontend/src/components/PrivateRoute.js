import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, soloAdmin = false }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return <div>Cargando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (soloAdmin && usuario.rol !== 'administrador') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
