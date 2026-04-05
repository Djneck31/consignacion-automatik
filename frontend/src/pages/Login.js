import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      await login(usuario, password);
      navigate('/dashboard');
    } catch (e) {
      console.error('ERROR LOGIN REAL:', e);
      setError(e?.response?.data?.error || e?.message || 'Error real de conexión');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5'
      }}
    >
      <Paper elevation={4} sx={{ padding: 4, width: 360 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
          Consignación
        </Typography>

        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          by Automatik RD
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ backgroundColor: '#1a1a2e' }}
        >
          Entrar
        </Button>
      </Paper>
    </Box>
  );
}
