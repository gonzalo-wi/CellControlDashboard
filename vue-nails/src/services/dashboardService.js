import axios from 'axios';
import { API_HOST } from './config';

// Configuración de la API base
const API_BASE_URL = `${API_HOST}/api/reparaciones/estadisticas`;

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('auth_username');
    const password = localStorage.getItem('auth_password');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (username && password) {
      const credentials = btoa(`${username}:${password}`);
      config.headers.Authorization = `Basic ${credentials}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.message);
    } else {
      console.error('Error en la configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default {
  /**
   * Obtener datos generales del dashboard
   */
  obtenerDashboard() {
    return apiClient.get('/dashboard');
  },

  /**
   * Obtener estadísticas de proveedores
   */
  obtenerEstadisticasProveedores() {
    return apiClient.get('/proveedores');
  },

  /**
   * Obtener estadísticas de órdenes de reparación
   */
  obtenerEstadisticasOrdenes() {
    return apiClient.get('/ordenes');
  },

  /**
   * Obtener estadísticas de items de reparación
   */
  obtenerEstadisticasItems() {
    return apiClient.get('/items');
  },

  /**
   * Obtener rendimiento de proveedores
   */
  obtenerRendimientoProveedores() {
    return apiClient.get('/rendimiento-proveedores');
  },

  /**
   * Obtener reparaciones más comunes
   */
  obtenerReparacionesComunes() {
    return apiClient.get('/reparaciones-comunes');
  },

  /**
   * Obtener alertas de órdenes vencidas
   */
  obtenerAlertas() {
    return apiClient.get('/alertas');
  },

  /**
   * Cambiar la URL base de la API
   */
  setBaseURL(baseUrl) {
    apiClient.defaults.baseURL = baseUrl;
  },

  /**
   * Configurar autenticación con token Bearer
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * Configurar autenticación Basic
   */
  setBasicAuth(username, password) {
    if (username && password) {
      localStorage.setItem('auth_username', username);
      localStorage.setItem('auth_password', password);
    } else {
      localStorage.removeItem('auth_username');
      localStorage.removeItem('auth_password');
    }
  },

  /**
   * Limpiar autenticación
   */
  clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_password');
  },
};
