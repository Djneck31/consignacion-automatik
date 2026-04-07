import { Box, Typography, Grid, Card, CardContent, Stack, Chip } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import Navbar from '../components/Navbar';

export default function Administracion() {
  const items = [
    {
      title: 'Empleados',
      description: 'Mensajeros, administradores y permisos.',
      icon: <GroupIcon />,
      color: '#2563eb'
    },
    {
      title: 'Puntos',
      description: 'Locales, responsables y porcentaje local.',
      icon: <StoreIcon />,
      color: '#10b981'
    },
    {
      title: 'Catálogo',
      description: 'Productos, precios y categorías.',
      icon: <Inventory2Icon />,
      color: '#f59e0b'
    },
    {
      title: 'Reportes',
      description: 'Ventas, visitas, incidencias y cierres.',
      icon: <AssessmentIcon />,
      color: '#7c3aed'
    }
  ];

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
            Administración
          </Typography>

          <Typography color="text.secondary">
            Panel administrativo base de PuntoConsigna.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        bgcolor: item.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography fontWeight="bold" fontSize="1.05rem">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip icon={<SettingsIcon />} label="Módulo en construcción" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
