import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GroupIcon from '@mui/icons-material/Group';
import { getNegocios, getVisitas, getEmpleados, getProductos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({
    negocios: 0,
    visitas: 0,
    empleados: 0,
    productos: 0
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const [n, v, p] = await Promise.all([getNegocios(), getVisitas(), getProductos()]);
        let e = { data: [] };

        if (usuario?.rol === 'administrador') {
          e = await getEmpleados();
        }

        setStats({
          negocios: n.data.length,
          visitas: v.data.length,
          productos: p.data.length,
          empleados: e.data.length
        });
      } catch (error) {
        console.error(error);
      }
    };

    cargar();
  }, [usuario]);

  const cards = [
    {
      title: 'Negocios',
      value: stats.negocios,
      icon: <StoreIcon />,
      color: '#2563eb'
    },
    {
      title: 'Productos',
      value: stats.productos,
      icon: <Inventory2Icon />,
      color: '#f59e0b'
    },
    {
      title: 'Visitas',
      value: stats.visitas,
      icon: <AssignmentTurnedInIcon />,
      color: '#10b981'
    }
  ];

  if (usuario?.rol === 'administrador') {
    cards.push({
      title: 'Empleados',
      value: stats.empleados,
      icon: <GroupIcon />,
      color: '#7c3aed'
    });
  }

  return (
    <>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={1} mb={3}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}
          >
            Hola, {usuario?.nombre}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={usuario?.rol || 'usuario'} color="primary" size="small" />
            <Typography color="text.secondary">
              Panel principal del sistema
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={2.5}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} lg={3} key={card.title}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: card.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {card.icon}
                    </Box>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1.8rem', md: '2rem' } }}
                    >
                      {card.value}
                    </Typography>
                  </Stack>

                  <Typography fontWeight="bold">{card.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resumen actualizado
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            p: 2.5
          }}
        >
          <Typography fontWeight="bold" mb={1}>
            Estado del sistema
          </Typography>
          <Typography color="text.secondary">
            Esta versión está enfocada en celular y tablet. Próximo paso: flujo real de consignación,
            evidencias, rutas y cálculos automáticos.
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
