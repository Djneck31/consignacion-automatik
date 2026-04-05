import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Alert, MenuItem } from '@mui/material';
import { getEmpleados, crearEmpleado, editarEmpleado, desactivarEmpleado } from '../services/api';
import Navbar from '../components/Navbar';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', correo: '', usuario: '', password: '', telefono: '', rol: 'mensajero' });
  const [mensaje, setMensaje] = useState('');

  const cargar = async () => {
    const res = await getEmpleados();
    setEmpleados(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const abrir = (emp = null) => {
    setEditando(emp);
    setForm(emp ? { ...emp, password: '' } : { nombre: '', correo: '', usuario: '', password: '', telefono: '', rol: 'mensajero' });
    setOpen(true);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await editarEmpleado(editando.id, form);
      } else {
        await crearEmpleado(form);
      }
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
          <Typography variant="h5" fontWeight="bold">Empleados</Typography>
          <Button variant="contained" onClick={() => abrir()}>+ Nuevo Empleado</Button>
        </Box>
        {mensaje && <Alert sx={{ mb: 2 }} severity="success" onClose={() => setMensaje('')}>{mensaje}</Alert>}
        <Paper elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a1a2e' }}>
                {['Nombre', 'Usuario', 'Correo', 'Teléfono', 'Rol', 'Estado', 'Acciones'].map(h => (
                  <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map(e => (
                <TableRow key={e.id}>
                  <TableCell>{e.nombre}</TableCell>
                  <TableCell>{e.usuario}</TableCell>
                  <TableCell>{e.correo}</TableCell>
                  <TableCell>{e.telefono}</TableCell>
                  <TableCell>{e.rol}</TableCell>
                  <TableCell>{e.estado}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => abrir(e)}>Editar</Button>
                    <Button size="small" color="error" onClick={() => desactivarEmpleado(e.id).then(cargar)}>Desactivar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editando ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Nombre" value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <TextField label="Correo" value={form.correo || ''} onChange={e => setForm({ ...form, correo: e.target.value })} />
            <TextField label="Usuario" value={form.usuario || ''} onChange={e => setForm({ ...form, usuario: e.target.value })} />
            <TextField label="Contraseña" type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} />
            <TextField label="Teléfono" value={form.telefono || ''} onChange={e => setForm({ ...form, telefono: e.target.value })} />
            <TextField select label="Rol" value={form.rol || 'mensajero'} onChange={e => setForm({ ...form, rol: e.target.value })}>
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="mensajero">Mensajero</MenuItem>
            </TextField>
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
