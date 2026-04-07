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
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SaveIcon from '@mui/icons-material/Save';
import Navbar from '../components/Navbar';

export default function NuevoPunto() {
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
            Nuevo Punto
          </Typography>

          <Typography color="text.secondary">
            Crea un local nuevo con datos, ubicación, fotos y carga inicial.
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
                    Datos del local
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Información básica del punto de consignación.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField label="Nombre del local" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Responsable" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Teléfono" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="% ganancia local" fullWidth type="number" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Dirección" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Referencia" fullWidth />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Ubicación
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Guarda el punto exacto para abrirlo luego en Maps o Waze.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button variant="contained" startIcon={<AddLocationAltIcon />} sx={{ minHeight: 48 }}>
                      Usar mi ubicación actual
                    </Button>
                    <Button variant="outlined" sx={{ minHeight: 48 }}>
                      Ver en mapa
                    </Button>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Fotos base del punto
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Frente del local, vitrina y referencia visual.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card elevation={0} sx={{ border: '1px dashed #cbd5e1', borderRadius: 4 }}>
                        <CardContent>
                          <Stack spacing={1.5} alignItems="center" textAlign="center">
                            <PhotoCameraIcon sx={{ fontSize: 34, color: '#64748b' }} />
                            <Typography fontWeight="bold">Foto del frente</Typography>
                            <Button variant="outlined" size="small">Subir</Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card elevation={0} sx={{ border: '1px dashed #cbd5e1', borderRadius: 4 }}>
                        <CardContent>
                          <Stack spacing={1.5} alignItems="center" textAlign="center">
                            <PhotoCameraIcon sx={{ fontSize: 34, color: '#64748b' }} />
                            <Typography fontWeight="bold">Foto de vitrina</Typography>
                            <Button variant="outlined" size="small">Subir</Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card elevation={0} sx={{ border: '1px dashed #cbd5e1', borderRadius: 4 }}>
                        <CardContent>
                          <Stack spacing={1.5} alignItems="center" textAlign="center">
                            <PhotoCameraIcon sx={{ fontSize: 34, color: '#64748b' }} />
                            <Typography fontWeight="bold">Foto referencia</Typography>
                            <Button variant="outlined" size="small">Subir</Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Carga inicial de productos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Aquí se agregan los productos que se dejan por primera vez.
                  </Typography>

                  <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 4 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                          <TextField label="Producto" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField label="Cantidad" fullWidth type="number" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Inventory2Icon />}
                            sx={{ minHeight: 56 }}
                          >
                            Agregar producto
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="contained" startIcon={<SaveIcon />} sx={{ minHeight: 48 }}>
                    Guardar punto completo
                  </Button>
                  <Button variant="outlined" sx={{ minHeight: 48 }}>
                    Cancelar
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
                    Flujo esperado
                  </Typography>
                  <Stack spacing={1}>
                    <Chip label="1. Datos del local" />
                    <Chip label="2. Ubicación actual" />
                    <Chip label="3. Fotos base" />
                    <Chip label="4. Carga inicial" />
                    <Chip label="5. Guardar todo" />
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography fontWeight="bold" mb={1}>
                    Nota
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En la siguiente fase esto se conectará a base de datos, ubicación real, carga de imágenes
                    y productos dinámicos del catálogo.
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
