import { Box, Typography, Paper, Card, CardContent, Stack, Button } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import NearMeIcon from '@mui/icons-material/NearMe';
import Navbar from '../components/Navbar';

export default function RutaDia() {
  return (
    <>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Ruta del Día
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Próxima fase: orden de visitas, cercanía y navegación.
        </Typography>

        <Stack spacing={2}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
            <CardContent>
              <Typography fontWeight="bold">Ejemplo de parada</Typography>
              <Typography color="text.secondary" mb={2}>
                Punto pendiente con acceso rápido al mapa.
              </Typography>

              <Stack spacing={1}>
                <Button variant="outlined" startIcon={<RoomIcon />}>
                  Abrir en Google Maps
                </Button>
                <Button variant="outlined" startIcon={<NearMeIcon />}>
                  Abrir en Waze
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
}
