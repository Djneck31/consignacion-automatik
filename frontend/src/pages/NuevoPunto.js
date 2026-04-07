import { Box, Typography, Paper, Stack, TextField, Button } from '@mui/material';
import Navbar from '../components/Navbar';

export default function NuevoPunto() {
  return (
    <>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Nuevo Punto
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Próxima fase: local, ubicación, fotos y productos iniciales.
        </Typography>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
          <Stack spacing={2}>
            <TextField label="Nombre del local" fullWidth />
            <TextField label="Responsable" fullWidth />
            <TextField label="Teléfono" fullWidth />
            <TextField label="Dirección" fullWidth />
            <TextField label="Referencia" fullWidth />
            <TextField label="% ganancia local" fullWidth />
            <Button variant="contained">Usar mi ubicación actual</Button>
            <Button variant="outlined">Subir foto del frente</Button>
            <Button variant="outlined">Subir foto de vitrina</Button>
            <Button variant="outlined">Agregar productos iniciales</Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
