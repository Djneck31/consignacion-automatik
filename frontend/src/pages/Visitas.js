import { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert } from '@mui/material';
import { getVisitas, crearVisita, actualizarEstadoVisita, getNegocios } from '../services/api';
import Navbar from '../components/Navbar';

const colores = { pendiente: 'warning', visitado: 'success', no_visitado: 'error', incidencia: 'secondary' };

export default function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ negocio_id: '', dinero_recogido: '', porcentaje_pagado: '', observaciones: '' });
  const [mensaje, setMensaje] = useState('');

  const cargar = async () => {
    const [v, n] = await Promise.all([getVisitas(), getNegocios()]);
    setVisitas(v.data);
    setNegocios(n.data);
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    try {
      await crearVisita(form);
      setMensaje('Visita registrada');
      setOpen(false);
      cargar();
    } catch {
      setMensaje('Error al registrar');
    }
  };

  const cambiarEstado = async (id, estado) => {
    await actualizarEstadoVisita(id, { estado });
    cargar();
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Visitas</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>+ Nueva Visita</Button>
        </Box>
        {mensaje && <Alert sx={{ mb: 2 }} severity="success" onClose={() => setMensaje('')}>{mensaje}</Alert>}
        <Paper elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a1a2e' }}>
                {['Negocio', 'Mensajero', 'Estado', 'Dinero Recogido', '% Pagado', 'Fecha', 'Acciones'].map(h => (
                  <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visitas.map(v => (
                <TableRow key={v.id}>
                  <TableCell>{v.negocios?.nombre}</TableCell>
                  <TableCell>{v.empleados?.nombre}</TableCell>
                  <TableCell><Chip label={v.estado} color={colores[v.estado]} size="small" /></TableCell>
                  <TableCell>RD$ {v.dinero_recogido}</TableCell>
                  <TableCell>{v.porcentaje_pagado}%</TableCell>
                  <TableCell>{new Date(v.fecha).toLocaleDateString('es-DO')}</TableCell>
                  <TableCell>
                    <TextField select size="small" value={v.estado} onChange={e => cambiarEstado(v.id, e.target.value)} sx={{ minWidth: 130 }}>
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

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Nueva Visita</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField select label="Negocio" value={form.negocio_id} onChange={e => setForm({ ...form, negocio_id: e.target.value })}>
              {negocios.map(n => <MenuItem key={n.id} value={n.id}>{n.nombre}</MenuItem>)}
            </TextField>
            <TextField label="Dinero recogido" type="number" value={form.dinero_recogido} onChange={e => setForm({ ...form, dinero_recogido: e.target.value })} />
            <TextField label="Porcentaje pagado" type="number" value={form.porcentaje_pagado} onChange={e => setForm({ ...form, porcentaje_pagado: e.target.value })} />
            <TextField label="Observaciones" multiline rows={3} value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={guardar}>Registrar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
