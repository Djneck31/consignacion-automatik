import { Box, Typography, Paper, Stack, TextField, Button } from '@mui/material';
import Navbar from '../components/Navbar';

export default function Reposicion() {
  return (
    <>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Reposición
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Próxima fase: contar productos, reponer, retirar y calcular.
        </Typography>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb' }}>
          <Stack spacing={2}>
            <TextField label="Producto" fullWidth />
            <TextField label="Cantidad anterior" fullWidth />
            <TextField label="Cantidad contada" fullWidth />
            <TextField label="Cantidad repuesta" fullWidth />
            <TextField label="Cantidad retirada" fullWidth />
            <Button variant="contained">Guardar movimiento</Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
