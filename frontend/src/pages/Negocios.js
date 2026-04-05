import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapIcon from '@mui/icons-material/Map';
import {
  getNegocios,
  crearNegocio,
  editarNegocio,
  desactivarNegocio
} from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Negocios() {
  const { usuario } = useAuth();
  const [negocios, setNegocios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    responsable: '',
    telefono: '',
    direccion: '',
    referencia: '',
    porcentaje: '',
    latitud: '',
    longitud: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const cargar = async () => {
    try {
      const res = await getNegocios();
      setNegocios(res.data);
    } catch {
      setMensaje('Error cargando negocios');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrir = (negocio = null) => {
    setEditando(negocio);
    setForm(
      negocio || {
        nombre: '',
        responsable: '',
        telefono: '',
        direccion: '',
        referencia: '',
        porcentaje: '',
        latitud: '',
        longitud: ''
      }
    );
    setOpen(true);
  };

  const cerrar = () => {
    setOpen(false);
    setEditando(null);
    setCargandoUbicacion(false);
  };

  const guardar = async () => {
    try {
      if (!form.nombre?.trim()) {
        setMensaje('El nombre del negocio es obligatorio');
        return;
      }

      if (editando) {
        await editarNegocio(editando.id, form);
      } else {
        await crearNegocio(form);
      }

      setMensaje('Guardado exitosamente');
      cerrar();
      cargar();
    } catch {
      setMensaje('Error al guardar');
    }
  };

  const desactivar = async (id) => {
    try {
      await desactivarNegocio(id);
      setMensaje('Negocio desactivado');
      cargar();
    } catch {
      setMensaje('Error al desactivar');
    }
  };

  const usarUbicacionActual = () => {
    if (!navigator.geolocation) {
      setMensaje('Este dispositivo no soporta geolocalización');
      return;
    }

    setCargandoUbicacion(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(7);
        const lng = position.coords.longitude.toFixed(7);

        setForm((prev) => ({
          ...prev,
          latitud: lat,
          longitud: lng
        }));

        setCargandoUbicacion(false);
        setMensaje('Ubicación capturada correctamente');
      },
      (error) => {
        let texto = 'No se pudo obtener la ubicación';

        if (error.code === 1) texto = 'Permiso de ubicación denegado';
        if (error.code === 2) texto = 'Ubicación no disponible';
        if (error.code === 3) texto = 'Tiempo agotado al buscar ubicación';

        setCargandoUbicacion(false);
        setMensaje(texto);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const abrirGoogleMaps = (latitud, longitud) => {
    if (!latitud || !longitud) return;
    window.open(`https://www.google.com/maps?q=${latitud},${longitud}`, '_blank');
  };

  const campos = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'responsable', label: 'Responsable' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'referencia', label: 'Referencia' },
    { key: 'porcentaje', label: 'Porcentaje' },
    { key: 'latitud', label: 'Latitud' },
    { key: 'longitud', label: 'Longitud' }
  ];

  return (
    <>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          mb={3}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' } }}
          >
            Negocios
          </Typography>

          {usuario.rol === 'administrador' && (
            <Button
              variant="contained"
              onClick={() => abrir()}
              sx={{ width: { xs: '100%', md: 'auto' }, minHeight: 48 }}
            >
              + Nuevo Negocio
            </Button>
          )}
        </Stack>

        {mensaje && (
          <Alert
            sx={{ mb: 2 }}
            severity={mensaje.toLowerCase().includes('error') ? 'error' : 'success'}
            onClose={() => setMensaje('')}
          >
            {mensaje}
          </Alert>
        )}

        {esMovil ? (
          <Stack spacing={2}>
            {negocios.map((n) => (
              <Card key={n.id} elevation={2}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {n.nombre}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Responsable:</strong> {n.responsable || '-'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Teléfono:</strong> {n.telefono || '-'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dirección:</strong> {n.direccion || '-'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Referencia:</strong> {n.referencia || '-'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>% Acuerdo:</strong> {n.porcentaje || 0}%
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    <strong>Estado:</strong> {n.estado}
                  </Typography>

                  <Stack spacing={1}>
                    {(n.latitud && n.longitud) && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MapIcon />}
                        onClick={() => abrirGoogleMaps(n.latitud, n.longitud)}
                      >
                        Abrir en Google Maps
                      </Button>
                    )}

                    {usuario.rol === 'administrador' && (
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" onClick={() => abrir(n)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => desactivar(n.id)}>
                          Desactivar
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper elevation={2} sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1a1a2e' }}>
                  {['Nombre', 'Responsable', 'Teléfono', 'Dirección', 'Referencia', '%', 'Mapa', 'Estado', 'Acciones'].map((h) => (
                    <TableCell
                      key={h}
                      sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {negocios.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>{n.nombre}</TableCell>
                    <TableCell>{n.responsable}</TableCell>
                    <TableCell>{n.telefono}</TableCell>
                    <TableCell>{n.direccion}</TableCell>
                    <TableCell>{n.referencia}</TableCell>
                    <TableCell>{n.porcentaje}%</TableCell>
                    <TableCell>
                      {(n.latitud && n.longitud) ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<MapIcon />}
                          onClick={() => abrirGoogleMaps(n.latitud, n.longitud)}
                        >
                          Ver mapa
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{n.estado}</TableCell>
                    <TableCell>
                      {usuario.rol === 'administrador' && (
                        <Stack direction="row" spacing={1}>
                          <Button size="small" onClick={() => abrir(n)}>
                            Editar
                          </Button>
                          <Button size="small" color="error" onClick={() => desactivar(n.id)}>
                            Desactivar
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Dialog
          open={open}
          onClose={cerrar}
          fullWidth
          maxWidth="sm"
          fullScreen={esMovil}
        >
          <DialogTitle>
            {editando ? 'Editar Negocio' : 'Nuevo Negocio'}
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {campos.map((campo) => (
                <TextField
                  key={campo.key}
                  label={campo.label}
                  value={form[campo.key] || ''}
                  onChange={(e) =>
                    setForm({ ...form, [campo.key]: e.target.value })
                  }
                  fullWidth
                  type={campo.key === 'porcentaje' ? 'number' : 'text'}
                />
              ))}

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
              >
                <Button
                  variant="contained"
                  startIcon={
                    cargandoUbicacion ? <CircularProgress size={18} color="inherit" /> : <MyLocationIcon />
                  }
                  onClick={usarUbicacionActual}
                  disabled={cargandoUbicacion}
                  sx={{ minHeight: 48 }}
                >
                  {cargandoUbicacion ? 'Capturando ubicación...' : 'Usar mi ubicación actual'}
                </Button>

                {(form.latitud && form.longitud) && (
                  <Button
                    variant="outlined"
                    startIcon={<MapIcon />}
                    onClick={() => abrirGoogleMaps(form.latitud, form.longitud)}
                    sx={{ minHeight: 48 }}
                  >
                    Ver en Google Maps
                  </Button>
                )}
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={cerrar}>Cancelar</Button>
            <Button variant="contained" onClick={guardar}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
