import axios from 'axios';
import { API_HOST } from './config';

const apiClient = axios.create({
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar autenticación
apiClient.interceptors.request.use(
  (config) => {
    const username = localStorage.getItem('auth_username');
    const password = localStorage.getItem('auth_password');

    if (username && password) {
      const credentials = btoa(`${username}:${password}`);
      config.headers.Authorization = `Basic ${credentials}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  /**
   * Obtener todos los usuarios con sus líneas
   */
  obtenerUsuarios() {
    return apiClient.get('/api/usuarios');
  },

  /**
   * Configurar autenticación Basic
   */
  setBasicAuth(username, password) {
    if (username && password) {
      localStorage.setItem('auth_username', username);
      localStorage.setItem('auth_password', password);
    }
  },
};
