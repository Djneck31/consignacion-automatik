import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import Navbar from '../components/Navbar';

export default function Reposicion() {
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
            Reposición
          </Typography>

          <Typography color="text.secondary">
            Cuenta, repone, retira y calcula el movimiento del punto.
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
              <Stack spacing={3}>
                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Datos de la visita
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField label="Punto" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Fecha" fullWidth />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                  <CardContent>
                    <Typography fontWeight="bold" mb={2}>
                      Movimiento por producto
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField label="Producto" fullWidth />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField label="Anterior" fullWidth type="number" />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField label="Contado" fullWidth type="number" />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField label="Repuesto" fullWidth type="number" />
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <TextField label="Retirado" fullWidth type="number" />
                      </Grid>
                    </Grid>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={2}>
                      <Button variant="outlined" startIcon={<Inventory2Icon />}>
                        Agregar producto
                      </Button>
                      <Button variant="contained" startIcon={<CalculateIcon />}>
                        Calcular resumen
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                  <CardContent>
                    <Typography fontWeight="bold" mb={2}>
                      Resumen estimado
                    </Typography>

                    <Stack spacing={1.5}>
                      <Chip label="Total vendido: pendiente" />
                      <Chip label="Ganancia local: pendiente" />
                      <Chip label="Ganancia empresa: pendiente" />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
              <CardContent>
                <Typography fontWeight="bold" mb={1}>
                  Qué hará esta pantalla
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Aquí se registrará lo contado, lo vendido, lo retirado y lo repuesto.
                </Typography>

                <Stack spacing={1}>
                  <Chip label="Conteo actual" />
                  <Chip label="Reposición" />
                  <Chip label="Retiro" />
                  <Chip label="Cálculo automático" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
