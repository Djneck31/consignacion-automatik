import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    { label: 'Inicio', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Negocios', path: '/negocios', icon: <StoreIcon fontSize="small" /> },
    { label: 'Productos', path: '/productos', icon: <Inventory2Icon fontSize="small" /> },
    { label: 'Visitas', path: '/visitas', icon: <AssignmentTurnedInIcon fontSize="small" /> },
    { label: 'Mapa', path: '/mapa', icon: <MapIcon fontSize="small" /> }
  ];

  if (usuario?.rol === 'administrador') {
    items.push({ label: 'Empleados', path: '/empleados', icon: <GroupIcon fontSize="small" /> });
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: '#111827',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
            <Avatar sx={{ bgcolor: '#2563eb', width: 36, height: 36, fontWeight: 'bold' }}>
              C
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Consignación
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '0.7rem', md: '0.78rem' },
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
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 999,
                  px: 2,
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              color="error"
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderRadius: 999 }}
            >
              Salir
            </Button>
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
              Menú
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
