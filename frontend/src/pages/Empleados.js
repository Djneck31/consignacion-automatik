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
  MenuItem,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  getEmpleados,
  crearEmpleado,
  editarEmpleado,
  desactivarEmpleado
} from '../services/api';
import Navbar from '../components/Navbar';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    usuario: '',
    password: '',
    telefono: '',
    rol: 'mensajero'
  });

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const cargar = async () => {
    try {
      const res = await getEmpleados();
      setEmpleados(res.data);
    } catch {
      setMensaje('Error cargando empleados');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrir = (emp = null) => {
    setEditando(emp);
    setForm(
      emp
        ? {
            nombre: emp.nombre || '',
            correo: emp.correo || '',
            usuario: emp.usuario || '',
            password: '',
            telefono: emp.telefono || '',
            rol: emp.rol || 'mensajero',
            estado: emp.estado || 'activo'
          }
        : {
            nombre: '',
            correo: '',
            usuario: '',
            password: '',
            telefono: '',
            rol: 'mensajero',
            estado: 'activo'
          }
    );
    setOpen(true);
  };

  const guardar = async () => {
    try {
      if (!form.nombre?.trim()) {
        setMensaje('El nombre es obligatorio');
        return;
      }

      if (editando) {
        await editarEmpleado(editando.id, form);
      } else {
        await crearEmpleado(form);
      }

      setMensaje('Empleado guardado');
      setOpen(false);
      setEditando(null);
      cargar();
    } catch {
      setMensaje('Error al guardar');
    }
  };

  const eliminar = async (id) => {
    try {
      await desactivarEmpleado(id);
      setMensaje('Empleado desactivado');
      cargar();
    } catch {
      setMensaje('Error al desactivar');
    }
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
              Empleados
            </Typography>
            <Typography color="text.secondary">
              Gestión de mensajeros y administradores
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => abrir()}
            sx={{ width: { xs: '100%', md: 'auto' }, minHeight: 48 }}
          >
            + Nuevo Empleado
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
            {empleados.map((e) => (
              <Card key={e.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {e.nombre}
                  </Typography>

                  <Stack spacing={0.5}>
                    <Typography variant="body2"><strong>Usuario:</strong> {e.usuario}</Typography>
                    <Typography variant="body2"><strong>Correo:</strong> {e.correo}</Typography>
                    <Typography variant="body2"><strong>Teléfono:</strong> {e.telefono || '-'}</Typography>
                    <Typography variant="body2"><strong>Rol:</strong> {e.rol}</Typography>
                    <Typography variant="body2"><strong>Estado:</strong> {e.estado}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button size="small" variant="outlined" onClick={() => abrir(e)}>
                      Editar
                    </Button>
                    <Button size="small" color="error" variant="outlined" onClick={() => eliminar(e.id)}>
                      Desactivar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 950 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#111827' }}>
                  {['Nombre', 'Usuario', 'Correo', 'Teléfono', 'Rol', 'Estado', 'Acciones'].map((h) => (
                    <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {empleados.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.nombre}</TableCell>
                    <TableCell>{e.usuario}</TableCell>
                    <TableCell>{e.correo}</TableCell>
                    <TableCell>{e.telefono}</TableCell>
                    <TableCell>{e.rol}</TableCell>
                    <TableCell>{e.estado}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => abrir(e)}>Editar</Button>
                        <Button size="small" color="error" onClick={() => eliminar(e.id)}>Desactivar</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={esMovil}>
          <DialogTitle>{editando ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                fullWidth
              />

              <TextField
                label="Correo"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                fullWidth
              />

              <TextField
                label="Usuario"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                fullWidth
              />

              <TextField
                label="Contraseña"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                fullWidth
              />

              <TextField
                label="Teléfono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                fullWidth
              />

              <TextField
                select
                label="Rol"
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                fullWidth
              >
                <MenuItem value="administrador">Administrador</MenuItem>
                <MenuItem value="mensajero">Mensajero</MenuItem>
              </TextField>

              {editando && (
                <TextField
                  select
                  label="Estado"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  fullWidth
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </TextField>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={guardar}>Guardar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
