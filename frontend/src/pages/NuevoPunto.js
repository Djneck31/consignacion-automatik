import { useEffect, useState } from 'react';
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
  Chip,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/Navbar';
import { getProductos } from '../services/api';

const productoVacio = {
  producto_id: '',
  cantidad: '',
  precio: '',
  porcentaje_local: ''
};

export default function NuevoPunto() {
  const [catalogo, setCatalogo] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const [productos, setProductos] = useState([{ ...productoVacio }]);

  useEffect(() => {
    const cargarCatalogo = async () => {
      try {
        const res = await getProductos();
        const activos = Array.isArray(res.data)
          ? res.data.filter((p) => !p.estado || p.estado === 'activo')
          : [];

        setCatalogo(activos);
      } catch (error) {
        console.error(error);
        setMensaje('No se pudo cargar el catálogo de productos');
      } finally {
        setCargandoCatalogo(false);
      }
    };

    cargarCatalogo();
  }, []);

  const agregarProducto = () => {
    setProductos([...productos, { ...productoVacio }]);
  };

  const eliminarProducto = (index) => {
    if (productos.length === 1) {
      setProductos([{ ...productoVacio }]);
      return;
    }

    setProductos(productos.filter((_, i) => i !== index));
  };

  const actualizarProducto = (index, campo, valor) => {
    const copia = [...productos];
    copia[index][campo] = valor;
    setProductos(copia);
  };

  const seleccionarProducto = (index, productoId) => {
    const productoSeleccionado = catalogo.find((p) => String(p.id) === String(productoId));
    const copia = [...productos];

    copia[index].producto_id = productoId;
    copia[index].precio = productoSeleccionado?.precio ?? '';
    if (!copia[index].porcentaje_local) {
      copia[index].porcentaje_local = productoSeleccionado?.porcentaje_local ?? '';
    }

    setProductos(copia);
  };

  const totalUnidades = productos.reduce(
    (acc, item) => acc + (Number(item.cantidad) || 0),
    0
  );

  const totalEstimado = productos.reduce(
    (acc, item) => acc + ((Number(item.cantidad) || 0) * (Number(item.precio) || 0)),
    0
  );

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

        {mensaje && (
          <Alert
            sx={{ mb: 2 }}
            severity={mensaje.toLowerCase().includes('no se pudo') ? 'error' : 'info'}
            onClose={() => setMensaje('')}
          >
            {mensaje}
          </Alert>
        )}

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
                      <TextField label="% ganancia local general" fullWidth type="number" />
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
                    Los productos salen del catálogo real que tienes guardado en el sistema.
                  </Typography>

                  {cargandoCatalogo ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Cargando catálogo...
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack spacing={2}>
                      {productos.map((item, index) => {
                        const subtotal = (Number(item.cantidad) || 0) * (Number(item.precio) || 0);

                        return (
                          <Card
                            key={index}
                            elevation={0}
                            sx={{ border: '1px solid #e5e7eb', borderRadius: 4 }}
                          >
                            <CardContent>
                              <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography fontWeight="bold">
                                    Producto #{index + 1}
                                  </Typography>

                                  <IconButton color="error" onClick={() => eliminarProducto(index)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>

                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      select
                                      label="Producto"
                                      fullWidth
                                      value={item.producto_id}
                                      onChange={(e) => seleccionarProducto(index, e.target.value)}
                                    >
                                      <MenuItem value="">Seleccionar</MenuItem>
                                      {catalogo.map((producto) => (
                                        <MenuItem key={producto.id} value={producto.id}>
                                          {producto.nombre}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </Grid>

                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      label="Cantidad"
                                      type="number"
                                      fullWidth
                                      value={item.cantidad}
                                      onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)}
                                    />
                                  </Grid>

                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      label="Precio"
                                      type="number"
                                      fullWidth
                                      value={item.precio}
                                      onChange={(e) => actualizarProducto(index, 'precio', e.target.value)}
                                    />
                                  </Grid>

                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      label="% local"
                                      type="number"
                                      fullWidth
                                      value={item.porcentaje_local}
                                      onChange={(e) => actualizarProducto(index, 'porcentaje_local', e.target.value)}
                                    />
                                  </Grid>
                                </Grid>

                                <Chip
                                  label={`Subtotal estimado: RD$ ${subtotal.toFixed(2)}`}
                                  sx={{ width: 'fit-content' }}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      })}

                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={agregarProducto}
                        sx={{ minHeight: 50 }}
                      >
                        Agregar otro producto
                      </Button>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 4,
                          border: '1px solid #e5e7eb',
                          backgroundColor: '#f8fafc'
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography fontWeight="bold">Resumen de carga inicial</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total de unidades: <strong>{totalUnidades}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total estimado: <strong>RD$ {totalEstimado.toFixed(2)}</strong>
                          </Typography>
                        </Stack>
                      </Paper>
                    </Stack>
                  )}
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
                    <Chip label="4. Catálogo real" />
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
                    El siguiente paso será guardar de verdad este punto con sus productos iniciales,
                    fotos y ubicación en la base de datos.
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
