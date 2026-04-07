import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NuevoPunto from './pages/NuevoPunto';
import RutaDia from './pages/RutaDia';
import Reposicion from './pages/Reposicion';
import Evidencias from './pages/Evidencias';
import Administracion from './pages/Administracion';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/nuevo-punto"
            element={
              <PrivateRoute>
                <NuevoPunto />
              </PrivateRoute>
            }
          />

          <Route
            path="/ruta-dia"
            element={
              <PrivateRoute>
                <RutaDia />
              </PrivateRoute>
            }
          />

          <Route
            path="/reposicion"
            element={
              <PrivateRoute>
                <Reposicion />
              </PrivateRoute>
            }
          />

          <Route
            path="/evidencias"
            element={
              <PrivateRoute>
                <Evidencias />
              </PrivateRoute>
            }
          />

          <Route
            path="/administracion"
            element={
              <PrivateRoute soloAdmin={true}>
                <Administracion />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
