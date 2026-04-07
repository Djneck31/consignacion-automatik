import { Box, Grid, Typography, Card, CardContent, Stack, Paper, Chip } from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import RouteIcon from '@mui/icons-material/Route';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario } = useAuth();

  const cards = [
    {
      title: 'Nuevo Punto',
      description: 'Crea un local nuevo con ubicación, fotos y productos iniciales.',
      icon: <AddBusinessIcon />,
      color: '#2563eb'
    },
    {
      title: 'Ruta del Día',
      description: 'Consulta las visitas del día y abre cada punto en el mapa.',
      icon: <RouteIcon />,
      color: '#10b981'
    },
    {
      title: 'Reposición',
      description: 'Cuenta, repón, retira productos y calcula el movimiento del punto.',
      icon: <Inventory2Icon />,
      color: '#f59e0b'
    },
    {
      title: 'Evidencias',
      description: 'Sube fotos del frente, vitrina, productos defectuosos y observaciones.',
      icon: <PhotoCameraIcon />,
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
            Hola, {usuario?.nombre}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={usuario?.rol || 'usuario'} color="primary" size="small" />
            <Typography color="text.secondary">
              Base visual inicial de PuntoConsigna
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={2.5}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} key={card.title}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        bgcolor: card.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {card.icon}
                    </Box>

                    <Box>
                      <Typography fontWeight="bold" fontSize="1.05rem">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </Box>
                  </Stack>
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
            En esta nueva etapa
          </Typography>

          <Typography color="text.secondary">
            Aquí dejamos la estructura visual nueva. Lo siguiente será crear las pantallas reales:
            Nuevo Punto, Ruta del Día, Reposición, Evidencias y Administración.
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
