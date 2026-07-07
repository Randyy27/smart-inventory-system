import axios from 'axios';

// Instancia centralizada de Axios apuntando a Docker/Local
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;