import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { getProductos, crearProducto, editarProducto, desactivarProducto } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Productos() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ codigo: '', nombre: '', descripcion: '', categoria: '', precio: '' });
  const [mensaje, setMensaje] = useState('');

  const cargar = async () => {
    const res = await getProductos();
    setProductos(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const abrir = (p = null) => {
    setEditando(p);
    setForm(p || { codigo: '', nombre: '', descripcion: '', categoria: '', precio: '' });
    setOpen(true);
  };

  const guardar = async () => {
    try {
      if (editando) await editarProducto(editando.id, form);
      else await crearProducto(form);
      setMensaje('Guardado exitosamente');
      setOpen(false);
      cargar();
    } catch {
      setMensaje('Error al guardar');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Productos</Typography>
          {usuario.rol === 'administrador' && <Button variant="contained" onClick={() => abrir()}>+ Nuevo Producto</Button>}
        </Box>
        {mensaje && <Alert sx={{ mb: 2 }} severity="success" onClose={() => setMensaje('')}>{mensaje}</Alert>}
        <Paper elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a1a2e' }}>
                {['Código', 'Nombre', 'Categoría', 'Precio', 'Estado', 'Acciones'].map(h => (
                  <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.codigo}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell>RD$ {p.precio}</TableCell>
                  <TableCell>{p.estado}</TableCell>
                  <TableCell>
                    {usuario.rol === 'administrador' && (
                      <>
                        <Button size="small" onClick={() => abrir(p)}>Editar</Button>
                        <Button size="small" color="error" onClick={() => desactivarProducto(p.id).then(cargar)}>Desactivar</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editando ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {['codigo', 'nombre', 'descripcion', 'categoria', 'precio'].map(campo => (
              <TextField key={campo} label={campo.charAt(0).toUpperCase() + campo.slice(1)} value={form[campo] || ''} onChange={e => setForm({ ...form, [campo]: e.target.value })} />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={guardar}>Guardar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
