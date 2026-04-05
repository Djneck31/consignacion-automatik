import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { getNegocios, crearNegocio, editarNegocio, desactivarNegocio } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Negocios() {
  const { usuario } = useAuth();
  const [negocios, setNegocios] = useState([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', responsable: '', telefono: '', direccion: '', referencia: '', porcentaje: '', latitud: '', longitud: '' });
  const [mensaje, setMensaje] = useState('');

  const cargar = async () => {
    const res = await getNegocios();
    setNegocios(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const abrir = (negocio = null) => {
    setEditando(negocio);
    setForm(negocio || { nombre: '', responsable: '', telefono: '', direccion: '', referencia: '', porcentaje: '', latitud: '', longitud: '' });
    setOpen(true);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await editarNegocio(editando.id, form);
      } else {
        await crearNegocio(form);
      }
      setMensaje('Guardado exitosamente');
      setOpen(false);
      cargar();
    } catch {
      setMensaje('Error al guardar');
    }
  };

  const desactivar = async (id) => {
    await desactivarNegocio(id);
    cargar();
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Negocios</Typography>
          {usuario.rol === 'administrador' && <Button variant="contained" onClick={() => abrir()}>+ Nuevo Negocio</Button>}
        </Box>
        {mensaje && <Alert sx={{ mb: 2 }} severity="success" onClose={() => setMensaje('')}>{mensaje}</Alert>}
        <Paper elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a1a2e' }}>
                {['Nombre', 'Responsable', 'Teléfono', 'Dirección', '% Acuerdo', 'Estado', 'Acciones'].map(h => (
                  <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {negocios.map(n => (
                <TableRow key={n.id}>
                  <TableCell>{n.nombre}</TableCell>
                  <TableCell>{n.responsable}</TableCell>
                  <TableCell>{n.telefono}</TableCell>
                  <TableCell>{n.direccion}</TableCell>
                  <TableCell>{n.porcentaje}%</TableCell>
                  <TableCell>{n.estado}</TableCell>
                  <TableCell>
                    {usuario.rol === 'administrador' && (
                      <>
                        <Button size="small" onClick={() => abrir(n)}>Editar</Button>
                        <Button size="small" color="error" onClick={() => desactivar(n.id)}>Desactivar</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editando ? 'Editar Negocio' : 'Nuevo Negocio'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {['nombre', 'responsable', 'telefono', 'direccion', 'referencia', 'porcentaje', 'latitud', 'longitud'].map(campo => (
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
