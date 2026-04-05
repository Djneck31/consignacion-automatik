import axios from 'axios';

const API = axios.create({
  baseURL: 'https://consignacion-backend.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => API.post('/auth/login', data);

export const getEmpleados = () => API.get('/empleados/');
export const crearEmpleado = (data) => API.post('/empleados/', data);
export const editarEmpleado = (id, data) => API.put(`/empleados/${id}`, data);
export const desactivarEmpleado = (id) => API.delete(`/empleados/${id}`);

export const getNegocios = () => API.get('/negocios/');
export const crearNegocio = (data) => API.post('/negocios/', data);
export const editarNegocio = (id, data) => API.put(`/negocios/${id}`, data);
export const desactivarNegocio = (id) => API.delete(`/negocios/${id}`);
export const asignarMensajero = (data) => API.post('/negocios/asignar', data);

export const getProductos = () => API.get('/productos/');
export const crearProducto = (data) => API.post('/productos/', data);
export const editarProducto = (id, data) => API.put(`/productos/${id}`, data);
export const desactivarProducto = (id) => API.delete(`/productos/${id}`);

export const getVisitas = () => API.get('/visitas/');
export const crearVisita = (data) => API.post('/visitas/', data);
export const actualizarEstadoVisita = (id, data) => API.put(`/visitas/${id}/estado`, data);
export const getReporteVisitas = (params) => API.get('/visitas/reporte', { params });

export const subirEvidencia = (data) => API.post('/evidencias/', data);
export const getEvidenciasVisita = (visita_id) => API.get(`/evidencias/visita/${visita_id}`);

export default API;
