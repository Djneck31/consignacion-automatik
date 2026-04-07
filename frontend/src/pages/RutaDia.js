import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import NearMeIcon from '@mui/icons-material/NearMe';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Navbar from '../components/Navbar';

const visitasDemo = [
  {
    id: 1,
    nombre: 'Colmado Peña',
    direccion: 'Calle Principal, Villa Mella',
    hora: '9:00 AM',
    estado: 'Pendiente'
  },
  {
    id: 2,
    nombre: 'Superette Ana',
    direccion: 'Sabana Perdida, Santo Domingo Norte',
    hora: '10:30 AM',
    estado: 'Pendiente'
  },
  {
    id: 3,
    nombre: 'Farmacia López',
    direccion: 'Los Mina, Santo Domingo Este',
    hora: '12:00 PM',
    estado: 'Pendiente'
  }
];

export default function RutaDia() {
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
            Ruta del Día
          </Typography>

          <Typography color="text.secondary">
            Ordena y consulta tus visitas del día con navegación rápida.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={8}>
            <Stack spacing={2}>
              {visitasDemo.map((visita, index) => (
                <Card key={visita.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1}
                      >
                        <Box>
                          <Typography fontWeight="bold" fontSize="1.05rem">
                            {index + 1}. {visita.nombre}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {visita.direccion}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip icon={<AccessTimeIcon />} label={visita.hora} />
                          <Chip label={visita.estado} color="warning" />
                        </Stack>
                      </Stack>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button variant="outlined" startIcon={<RoomIcon />} sx={{ minHeight: 46 }}>
                          Abrir en Google Maps
                        </Button>
                        <Button variant="outlined" startIcon={<NearMeIcon />} sx={{ minHeight: 46 }}>
                          Abrir en Waze
                        </Button>
                        <Button variant="contained" sx={{ minHeight: 46 }}>
                          Iniciar visita
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid #e5e7eb'
              }}
            >
              <Typography fontWeight="bold" mb={1}>
                Resumen de ruta
              </Typography>

              <Stack spacing={1.5}>
                <Chip label="3 visitas pendientes" color="primary" />
                <Chip label="Orden por cercanía: próxima fase" />
                <Chip label="Google Maps / Waze" />
                <Chip label="Vista pensada para mensajero" />
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                En la siguiente fase se conectará a visitas reales, orden automático y ubicación del negocio.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
