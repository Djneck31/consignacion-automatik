import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Navbar from '../components/Navbar';

export default function Evidencias() {
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
            Evidencias
          </Typography>

          <Typography color="text.secondary">
            Captura fotos del punto, vitrina y observaciones.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: '1px solid #e5e7eb'
              }}
            >
              <Stack spacing={2.5}>
                <TextField select label="Tipo de evidencia" fullWidth defaultValue="vitrina">
                  <MenuItem value="frente">Frente del local</MenuItem>
                  <MenuItem value="vitrina">Vitrina</MenuItem>
                  <MenuItem value="defectuoso">Producto defectuoso</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                </TextField>

                <TextField label="Comentario" multiline rows={4} fullWidth />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="contained" startIcon={<PhotoCameraIcon />} sx={{ minHeight: 48 }}>
                    Tomar o subir foto
                  </Button>
                  <Button variant="outlined" sx={{ minHeight: 48 }}>
                    Guardar evidencia
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={2}>
              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography fontWeight="bold" mb={1}>
                    Tipos de evidencia
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Frente, vitrina, defectuoso o general.
                  </Typography>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography fontWeight="bold" mb={1}>
                    Próxima fase
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aquí se conectará la cámara, carga real de imágenes y relación con la visita.
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
