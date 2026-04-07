import { Box, Typography, Paper, Stack, TextField, Button, MenuItem } from '@mui/material';
import Navbar from '../components/Navbar';

export default function Evidencias() {
  return (
    <>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Evidencias
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Próxima fase: fotos del local, vitrina, defectos y comentarios.
        </Typography>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
          <Stack spacing={2}>
            <TextField select label="Tipo de evidencia" fullWidth defaultValue="vitrina">
              <MenuItem value="frente">Frente del local</MenuItem>
              <MenuItem value="vitrina">Vitrina</MenuItem>
              <MenuItem value="defectuoso">Producto defectuoso</MenuItem>
              <MenuItem value="general">General</MenuItem>
            </TextField>

            <TextField label="Comentario" multiline rows={3} fullWidth />
            <Button variant="contained">Tomar o subir foto</Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
