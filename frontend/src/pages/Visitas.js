import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import NearMeIcon from '@mui/icons-material/NearMe';
import {
  getVisitas,
  crearVisita,
  actualizarEstadoVisita,
  getNegocios
} from '../services/api';
import Navbar from '../components/Navbar';

const colores = {
  pendiente: 'warning',
  visitado: 'success',
  no_visitado: 'error',
  incidencia: 'secondary'
};

export default function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState({
    negocio_id: '',
    dinero_recogido: '',
    porcentaje_pagado: '',
    observaciones: ''
  });

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const cargar = async () => {
    try {
      const [v, n] = await Promise.all([getVisitas(), getNegocios()]);
      setVisitas(v.data);
      setNegocios(n.data);
    } catch {
      setMensaje('Error cargando visitas');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async () => {
    try {
      if (!form.negocio_id) {
        setMensaje('Selecciona un negocio');
        return;
      }

      await crearVisita(form);
      setMensaje('Visita registrada');
      setOpen(false);
      setForm({
        negocio_id: '',
        dinero_recogido: '',
        porcentaje_pagado: '',
        observaciones: ''
      });
      cargar();
    } catch {
      setMensaje('Error al registrar');
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await actualizarEstadoVisita(id, { estado });
      cargar();
    } catch {
      setMensaje('Error cambiando estado');
    }
  };

  const abrirGoogleMaps = (latitud, longitud) => {
    if (!latitud || !longitud) return;
    window.open(`https://www.google.com/maps?q=${latitud},${longitud}`, '_blank');
  };

  const abrirWaze = (latitud, longitud) => {
    if (!latitud || !longitud) return;
    window.open(`https://waze.com/ul?ll=${latitud},${longitud}&navigate=yes`, '_blank');
  };

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
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' } }}
            >
              Visitas
            </Typography>
            <Typography color="text.secondary">
              Ruta diaria y acceso directo al mapa
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ width: { xs: '100%', md: 'auto' }, minHeight: 48 }}
          >
            + Nueva Visita
          </Button>
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
            {visitas.map((v) => (
              <Card key={v.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {v.negocios?.nombre || 'Negocio'}
                  </Typography>

                  <Stack spacing={0.75}>
                    <Typography variant="body2"><strong>Mensajero:</strong> {v.empleados?.nombre || '-'}</Typography>
                    <Typography variant="body2"><strong>Dinero:</strong> RD$ {v.dinero_recogido || 0}</Typography>
                    <Typography variant="body2"><strong>% pagado:</strong> {v.porcentaje_pagado || 0}%</Typography>
                    <Typography variant="body2"><strong>Fecha:</strong> {new Date(v.fecha).toLocaleDateString('es-DO')}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} mt={1.5} mb={2} flexWrap="wrap">
                    <Chip label={v.estado} color={colores[v.estado] || 'default'} size="small" />
                  </Stack>

                  {(v.negocios?.latitud && v.negocios?.longitud) && (
                    <Stack spacing={1} mb={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<RoomIcon />}
                        onClick={() => abrirGoogleMaps(v.negocios.latitud, v.negocios.longitud)}
                      >
                        Abrir en Google Maps
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<NearMeIcon />}
                        onClick={() => abrirWaze(v.negocios.latitud, v.negocios.longitud)}
                      >
                        Abrir en Waze
                      </Button>
                    </Stack>
                  )}

                  <TextField
                    select
                    size="small"
                    fullWidth
                    label="Estado"
                    value={v.estado}
                    onChange={(e) => cambiarEstado(v.id, e.target.value)}
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="visitado">Visitado</MenuItem>
                    <MenuItem value="no_visitado">No visitado</MenuItem>
                    <MenuItem value="incidencia">Incidencia</MenuItem>
                  </TextField>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1250 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#111827' }}>
                  {['Negocio', 'Mensajero', 'Estado', 'Dinero', '% Pagado', 'Fecha', 'Google Maps', 'Waze', 'Acciones'].map((h) => (
                    <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visitas.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.negocios?.nombre}</TableCell>
                    <TableCell>{v.empleados?.nombre}</TableCell>
                    <TableCell>
                      <Chip label={v.estado} color={colores[v.estado] || 'default'} size="small" />
                    </TableCell>
                    <TableCell>RD$ {v.dinero_recogido || 0}</TableCell>
                    <TableCell>{v.porcentaje_pagado || 0}%</TableCell>
                    <TableCell>{new Date(v.fecha).toLocaleDateString('es-DO')}</TableCell>
                    <TableCell>
                      {v.negocios?.latitud && v.negocios?.longitud ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<RoomIcon />}
                          onClick={() => abrirGoogleMaps(v.negocios.latitud, v.negocios.longitud)}
                        >
                          Maps
                        </Button>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {v.negocios?.latitud && v.negocios?.longitud ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<NearMeIcon />}
                          onClick={() => abrirWaze(v.negocios.latitud, v.negocios.longitud)}
                        >
                          Waze
                        </Button>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={v.estado}
                        onChange={(e) => cambiarEstado(v.id, e.target.value)}
                        sx={{ minWidth: 150 }}
                      >
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                        <MenuItem value="visitado">Visitado</MenuItem>
                        <MenuItem value="no_visitado">No visitado</MenuItem>
                        <MenuItem value="incidencia">Incidencia</MenuItem>
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={esMovil}>
          <DialogTitle>Nueva Visita</DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                label="Negocio"
                value={form.negocio_id}
                onChange={(e) => setForm({ ...form, negocio_id: e.target.value })}
                fullWidth
              >
                {negocios.map((n) => (
                  <MenuItem key={n.id} value={n.id}>
                    {n.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Dinero recogido"
                type="number"
                value={form.dinero_recogido}
                onChange={(e) => setForm({ ...form, dinero_recogido: e.target.value })}
                fullWidth
              />

              <TextField
                label="% pagado al local"
                type="number"
                value={form.porcentaje_pagado}
                onChange={(e) => setForm({ ...form, porcentaje_pagado: e.target.value })}
                fullWidth
              />

              <TextField
                label="Observaciones"
                multiline
                rows={3}
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={guardar}>Registrar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
