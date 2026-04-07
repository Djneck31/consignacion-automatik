import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Navbar from '../components/Navbar';

export default function Administracion() {
  const items = [
    { title: 'Empleados', icon: <GroupIcon />, color: '#2563eb' },
    { title: 'Puntos', icon: <StoreIcon />, color: '#10b981' },
    { title: 'Catálogo', icon: <Inventory2Icon />, color: '#f59e0b' },
    { title: 'Reportes', icon: <AssessmentIcon />, color: '#7c3aed' }
  ];

  return (
    <>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Administración
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Próxima fase: gestión completa de empresa, usuarios, catálogo y reportes.
        </Typography>

        <Grid container spacing={2.5}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 3,
                      bgcolor: item.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography fontWeight="bold">{item.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
