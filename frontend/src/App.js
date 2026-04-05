import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Negocios from './pages/Negocios';
import Empleados from './pages/Empleados';
import Productos from './pages/Productos';
import Visitas from './pages/Visitas';
import Mapa from './pages/Mapa';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/negocios" element={<PrivateRoute><Negocios /></PrivateRoute>} />
          <Route path="/empleados" element={<PrivateRoute soloAdmin={true}><Empleados /></PrivateRoute>} />
          <Route path="/productos" element={<PrivateRoute><Productos /></PrivateRoute>} />
          <Route path="/visitas" element={<PrivateRoute><Visitas /></PrivateRoute>} />
          <Route path="/mapa" element={<PrivateRoute><Mapa /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
