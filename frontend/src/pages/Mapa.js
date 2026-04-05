import { useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getNegocios } from '../services/api';
import Navbar from '../components/Navbar';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Mapa() {
  const [negocios, setNegocios] = useState([]);

  useEffect(() => {
    getNegocios().then(res => setNegocios(res.data.filter(n => n.latitud && n.longitud)));
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>Mapa de Negocios</Typography>
        <MapContainer center={[18.4861, -69.9312]} zoom={12} style={{ height: '70vh', borderRadius: 8 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {negocios.map(n => (
            <Marker key={n.id} position={[parseFloat(n.latitud), parseFloat(n.longitud)]}>
              <Popup>
                <strong>{n.nombre}</strong><br />
                {n.responsable}<br />
                {n.telefono}<br />
                {n.direccion}<br />
                <Chip label={n.estado} size="small" color={n.estado === 'activo' ? 'success' : 'error'} sx={{ mt: 1 }} /><br />
                <a href={`https://www.google.com/maps?q=${n.latitud},${n.longitud}`} target="_blank" rel="noreferrer">
                  Abrir en Google Maps
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </>
  );
}
