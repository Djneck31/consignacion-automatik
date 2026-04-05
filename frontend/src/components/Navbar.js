import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a2e' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Consignación by Automatik RD
        </Typography>
        {usuario && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>Inicio</Button>
            <Button color="inherit" onClick={() => navigate('/negocios')}>Negocios</Button>
            <Button color="inherit" onClick={() => navigate('/productos')}>Productos</Button>
            <Button color="inherit" onClick={() => navigate('/visitas')}>Visitas</Button>
            <Button color="inherit" onClick={() => navigate('/mapa')}>Mapa</Button>
            {usuario.rol === 'administrador' && (
              <Button color="inherit" onClick={() => navigate('/empleados')}>Empleados</Button>
            )}
            <Button color="error" variant="contained" onClick={handleLogout}>Salir</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
