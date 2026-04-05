import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { getNegocios, getVisitas, getEmpleados, getProductos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ negocios: 0, visitas: 0, empleados: 0, productos: 0 });

  useEffect(() => {
    const cargar = async () => {
      try {
        const [n, v, p] = await Promise.all([getNegocios(), getVisitas(), getProductos()]);
        let e = { data: [] };
        if (usuario.rol === 'administrador') e = await getEmpleados();
        setStats({ negocios: n.data.length, visitas: v.data.length, empleados: e.data.length, productos: p.data.length });
      } catch {}
    };
    cargar();
  }, [usuario]);

  const tarjeta = (titulo, valor, color) => (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', borderTop: `4px solid ${color}` }}>
        <Typography variant="h3" fontWeight="bold" color={color}>{valor}</Typography>
        <Typography variant="body1" color="text.secondary">{titulo}</Typography>
      </Paper>
    </Grid>
  );

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>Bienvenido, {usuario?.nombre}</Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>Panel de control — Consignación by Automatik RD</Typography>
        <Grid container spacing={3}>
          {tarjeta('Negocios', stats.negocios, '#1976d2')}
          {tarjeta('Visitas', stats.visitas, '#2e7d32')}
          {tarjeta('Productos', stats.productos, '#ed6c02')}
          {usuario.rol === 'administrador' && tarjeta('Empleados', stats.empleados, '#9c27b0')}
        </Grid>
      </Box>
    </>
  );
}

