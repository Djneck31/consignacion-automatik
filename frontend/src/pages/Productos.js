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
  MenuItem,
  Divider
} from '@mui/material';
import {
  getProductos,
  crearProducto,
  editarProducto,
  desactivarProducto
} from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Productos() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    porcentaje_local: ''
  });

  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const cargar = async () => {
    try {
      const res = await getProductos();
      setProductos(res.data);
    } catch {
      setMensaje('Error cargando productos');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrir = (producto = null) => {
    setEditando(producto);
    setForm(
      producto
        ? {
            codigo: producto.codigo || '',
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            categoria: producto.categoria || '',
            precio: producto.precio || '',
            porcentaje_local: producto.porcentaje_local || ''
          }
        : {
            codigo: '',
            nombre: '',
            descripcion: '',
            categoria: '',
            precio: '',
            porcentaje_local: ''
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

      const payload = {
        ...form,
        precio: form.precio === '' ? 0 : Number(form.precio),
        porcentaje_local: form.porcentaje_local === '' ? 0 : Number(form.porcentaje_local)
      };

      if (editando) {
        await editarProducto(editando.id, payload);
      } else {
        await crearProducto(payload);
      }

      setMensaje('Producto guardado');
      setOpen(false);
      setEditando(null);
      cargar();
    } catch {
      setMensaje('Error al guardar');
    }
  };

  const eliminar = async (id) => {
    try {
      await desactivarProducto(id);
      setMensaje('Producto desactivado');
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
              Productos
            </Typography>
            <Typography color="text.secondary">
              Catálogo base de consignación
            </Typography>
          </Box>

          {usuario?.rol === 'administrador' && (
            <Button
              variant="contained"
              onClick={() => abrir()}
              sx={{ width: { xs: '100%', md: 'auto' }, minHeight: 48 }}
            >
              + Nuevo Producto
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
            {productos.map((p) => (
              <Card key={p.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {p.nombre}
                  </Typography>

                  <Stack spacing={0.5}>
                    <Typography variant="body2"><strong>Código:</strong> {p.codigo || '-'}</Typography>
                    <Typography variant="body2"><strong>Categoría:</strong> {p.categoria || '-'}</Typography>
                    <Typography variant="body2"><strong>Precio:</strong> RD$ {p.precio || 0}</Typography>
                    <Typography variant="body2"><strong>% local:</strong> {p.porcentaje_local || 0}%</Typography>
                    <Typography variant="body2"><strong>Estado:</strong> {p.estado}</Typography>
                  </Stack>

                  {p.descripcion && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {p.descripcion}
                      </Typography>
                    </>
                  )}

                  {usuario?.rol === 'administrador' && (
                    <Stack direction="row" spacing={1} mt={2}>
                      <Button size="small" variant="outlined" onClick={() => abrir(p)}>
                        Editar
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => eliminar(p.id)}>
                        Desactivar
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#111827' }}>
                  {['Código', 'Nombre', 'Categoría', 'Precio', '% Local', 'Estado', 'Acciones'].map((h) => (
                    <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.codigo}</TableCell>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.categoria}</TableCell>
                    <TableCell>RD$ {p.precio || 0}</TableCell>
                    <TableCell>{p.porcentaje_local || 0}%</TableCell>
                    <TableCell>{p.estado}</TableCell>
                    <TableCell>
                      {usuario?.rol === 'administrador' && (
                        <Stack direction="row" spacing={1}>
                          <Button size="small" onClick={() => abrir(p)}>Editar</Button>
                          <Button size="small" color="error" onClick={() => eliminar(p.id)}>Desactivar</Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={esMovil}>
          <DialogTitle>{editando ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Código"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                fullWidth
              />

              <TextField
                label="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                fullWidth
              />

              <TextField
                select
                label="Categoría"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                fullWidth
              >
                <MenuItem value="">Seleccionar</MenuItem>
                <MenuItem value="snacks">Snacks</MenuItem>
                <MenuItem value="bebidas">Bebidas</MenuItem>
                <MenuItem value="dulces">Dulces</MenuItem>
                <MenuItem value="otros">Otros</MenuItem>
              </TextField>

              <TextField
                label="Precio"
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                fullWidth
              />

              <TextField
                label="% ganancia del local"
                type="number"
                value={form.porcentaje_local}
                onChange={(e) => setForm({ ...form, porcentaje_local: e.target.value })}
                fullWidth
              />

              <TextField
                label="Descripción"
                multiline
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                fullWidth
              />
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
