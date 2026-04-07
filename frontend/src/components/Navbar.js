import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import RouteIcon from '@mui/icons-material/Route';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const esAdmin = usuario?.rol === 'administrador';

  const items = [
    { label: 'Inicio', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Nuevo Punto', path: '/nuevo-punto', icon: <AddBusinessIcon fontSize="small" /> },
    { label: 'Ruta del Día', path: '/ruta-dia', icon: <RouteIcon fontSize="small" /> },
    { label: 'Reposición', path: '/reposicion', icon: <Inventory2Icon fontSize="small" /> },
    { label: 'Evidencias', path: '/evidencias', icon: <PhotoCameraIcon fontSize="small" /> }
  ];

  if (esAdmin) {
    items.push({
      label: 'Administración',
      path: '/administracion',
      icon: <AdminPanelSettingsIcon fontSize="small" />
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 68, md: 74 }, px: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
            <Avatar sx={{ bgcolor: '#2563eb', width: 40, height: 40, fontWeight: 800 }}>
              P
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                PuntoConsigna
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '0.72rem', md: '0.78rem' },
                  opacity: 0.75,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                by Automatik RD
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, alignItems: 'center' }}>
            {items.map((item) => (
              <Chip
                key={item.path}
                label={item.label}
                onClick={() => navigate(item.path)}
                icon={item.icon}
                variant={location.pathname === item.path ? 'filled' : 'outlined'}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.18)',
                  backgroundColor: location.pathname === item.path ? '#1d4ed8' : 'transparent',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            ))}

            <Chip
              label="Salir"
              onClick={handleLogout}
              icon={<LogoutIcon />}
              variant="filled"
              sx={{
                color: 'white',
                backgroundColor: '#dc2626',
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Box>

          <IconButton
            color="inherit"
            sx={{ display: { xs: 'flex', lg: 'none' } }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 290 }}>
          <Box sx={{ p: 2 }}>
            <Typography fontWeight="bold" fontSize="1.1rem">
              PuntoConsigna
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {usuario?.nombre} · {usuario?.rol}
            </Typography>
          </Box>

          <Divider />

          <List>
            {items.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
              >
                <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

            <Divider sx={{ my: 1 }} />

            <ListItemButton
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
            >
              <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>
                <LogoutIcon fontSize="small" />
              </Box>
              <ListItemText primary="Salir" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}


