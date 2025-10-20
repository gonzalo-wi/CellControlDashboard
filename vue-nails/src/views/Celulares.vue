<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
  <header class="bg-white shadow-sm dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Celulares</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Inventario y estadísticas de dispositivos</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="cargarDatos"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <svg 
                class="w-5 h-5" 
                :class="{ 'animate-spin': loading }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ loading ? 'Cargando...' : 'Actualizar' }}
            </button>
            <button 
              @click="exportarExcel"
              :disabled="!celulares || celulares.length === 0"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              Exportar Excel
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error Message -->
  <div v-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded dark:bg-red-900/30 dark:border-red-700">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700 dark:text-red-200">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Estadísticas de Celulares -->
      <div v-if="celulares && celulares.length > 0">
        <EstadisticasCelulares :celulares="celulares" />
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading && !celulares" label="Cargando celulares..." />

      <!-- Empty State -->
      <div v-if="!loading && (!celulares || celulares.length === 0)" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay celulares disponibles</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Verifica la conexión con la API.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EstadisticasCelulares from '../components/EstadisticasCelulares.vue';
import estadisticasService from '../services/estadisticasService';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { exportToExcel } from '../utils/exportExcel';

const loading = ref(false);
const error = ref(null);
const celulares = ref([]);

const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const username = localStorage.getItem('auth_username') || 'admin';
    const password = localStorage.getItem('auth_password') || 'admin123';
    estadisticasService.setBasicAuth(username, password);

    const response = await estadisticasService.obtenerTodosCelulares();
    celulares.value = response.data;
  } catch (err) {
    console.error('Error al cargar celulares:', err);
    
    if (err.response?.status === 401) {
      error.value = 'Error de autenticación. Verifica tus credenciales.';
    } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
      error.value = 'No se puede conectar con el servidor. Verifica que esté activo.';
    } else {
      error.value = `Error al cargar datos: ${err.message}`;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarDatos();
});

// Exportar a Excel
const exportarExcel = () => {
  const rows = (celulares.value || []).map(c => ({
    Marca: c.marca,
    Modelo: c.modelo,
    Estado: c.estado,
    Roturas: c.cantRoturas,
    Funda: c.tieneFunda ? 'Sí' : 'No',
    Templado: c.tieneTemplado ? 'Sí' : 'No',
  }));

  exportToExcel({
    filename: `celulares_${new Date().toISOString().slice(0,10)}.xlsx`,
    sheets: [
      { name: 'Celulares', data: rows }
    ]
  });
};
</script>
