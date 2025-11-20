<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white shadow-sm dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Líneas de Usuarios</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Gestión de líneas telefónicas por usuario</p>
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
              :disabled="usuarios.length === 0"
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

      <!-- Stats Cards -->
      <div v-if="usuarios.length > 0" class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Usuarios"
            :value="totalUsuarios"
            icon="users"
            color="blue"
            subtitle="En el sistema"
          />
          <StatsCard 
            title="Con Celular"
            :value="usuariosConCelular"
            icon="phone"
            color="green"
            :subtitle="`${porcentajeConCelular}% del total`"
          />
          <StatsCard 
            title="Total Celulares"
            :value="totalCelulares"
            icon="device"
            color="purple"
            subtitle="Asignados"
          />
          <StatsCard 
            title="Total Roturas"
            :value="totalRoturas"
            icon="alert"
            color="red"
            subtitle="Acumuladas"
          />
        </div>
      </div>

      <!-- Tabla de Usuarios -->
      <div v-if="usuarios.length > 0" class="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reparto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Línea
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Zona
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Región
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cargo
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Celulares
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Roturas
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Modelo Actual
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              <tr 
                v-for="(usuario, index) in usuariosPaginados" 
                :key="index"
                class="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span class="text-white font-bold text-sm">{{ usuario.numReparto }}</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">Reparto {{ usuario.numReparto }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="text-sm text-gray-900 dark:text-gray-100 font-mono">{{ usuario.numeroLinea || 'Sin línea' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600 dark:text-gray-300">{{ usuario.zona }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getRegionClass(usuario.region)"
                  >
                    {{ formatearRegion(usuario.region) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ usuario.cargo }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span 
                    class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {{ usuario.celulares.length }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span 
                    class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                    :class="getRoturasClass(usuario.cantCelularesRotos)"
                  >
                    {{ usuario.cantCelularesRotos }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div v-if="usuario.celular" class="text-sm">
                    <div class="font-medium text-gray-900 dark:text-gray-100">{{ usuario.celular.marca }} {{ usuario.celular.modelo }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Código: {{ usuario.celular.codigoInterno }}</div>
                  </div>
                  <span v-else class="text-sm text-gray-400 dark:text-gray-500">Sin celular</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="paginaActual--"
              :disabled="paginaActual === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="paginaActual++"
              :disabled="paginaActual === totalPaginas"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Mostrando
                <span class="font-medium">{{ (paginaActual - 1) * itemsPorPagina + 1 }}</span>
                a
                <span class="font-medium">{{ Math.min(paginaActual * itemsPorPagina, usuarios.length) }}</span>
                de
                <span class="font-medium">{{ usuarios.length }}</span>
                usuarios
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="paginaActual--"
                  :disabled="paginaActual === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Página {{ paginaActual }} de {{ totalPaginas }}
                </span>
                <button
                  @click="paginaActual++"
                  :disabled="paginaActual === totalPaginas"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Siguiente</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading && usuarios.length === 0" label="Cargando líneas..." />

      <!-- Empty State -->
      <div v-if="!loading && usuarios.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay usuarios</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron usuarios en el sistema.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import StatsCard from '../components/StatsCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import lineasService from '../services/lineasService';
import { exportToExcel } from '../utils/exportExcel';

const loading = ref(false);
const error = ref(null);
const usuarios = ref([]);
const paginaActual = ref(1);
const itemsPorPagina = 20;

// Formatear región
const formatearRegion = (region) => {
  if (!region) return 'Sin región';
  return region.replace(/_/g, ' ');
};

// Clase de color por región
const getRegionClass = (region) => {
  const regiones = {
    'NORTE': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'SUR': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'ESTE': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'OESTE': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  };
  return regiones[region] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

// Clase de color por roturas
const getRoturasClass = (roturas) => {
  if (roturas === 0) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  if (roturas <= 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  if (roturas <= 5) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
};

// Stats computadas
const totalUsuarios = computed(() => usuarios.value.length);

const usuariosConCelular = computed(() => 
  usuarios.value.filter(u => u.celular).length
);

const porcentajeConCelular = computed(() => {
  if (totalUsuarios.value === 0) return '0.0';
  return ((usuariosConCelular.value / totalUsuarios.value) * 100).toFixed(1);
});

const totalCelulares = computed(() => 
  usuarios.value.reduce((sum, u) => sum + u.celulares.length, 0)
);

const totalRoturas = computed(() => 
  usuarios.value.reduce((sum, u) => sum + (u.cantCelularesRotos || 0), 0)
);

// Paginación
const totalPaginas = computed(() => 
  Math.ceil(usuarios.value.length / itemsPorPagina)
);

const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  return usuarios.value.slice(inicio, fin);
});

// Cargar datos
const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const username = localStorage.getItem('auth_username') || 'admin';
    const password = localStorage.getItem('auth_password') || 'admin123';
    lineasService.setBasicAuth(username, password);

    const response = await lineasService.obtenerUsuarios();
    usuarios.value = response.data;
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    
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

// Exportar a Excel
const exportarExcel = () => {
  const datos = usuarios.value.map(u => ({
    Reparto: u.numReparto,
    Línea: u.numeroLinea || 'Sin línea',
    Zona: u.zona,
    Región: formatearRegion(u.region),
    Cargo: u.cargo,
    'Cantidad Celulares': u.celulares.length,
    'Celulares Rotos': u.cantCelularesRotos || 0,
    'Modelo Actual': u.celular ? `${u.celular.marca} ${u.celular.modelo}` : 'Sin celular',
    'Código Interno': u.celular ? u.celular.codigoInterno : '',
    Estado: u.celular ? u.celular.estado : '',
  }));

  exportToExcel({
    filename: `lineas_usuarios_${new Date().toISOString().slice(0, 10)}.xlsx`,
    sheets: [
      { name: 'Líneas', data: datos }
    ]
  });
};

onMounted(() => {
  cargarDatos();
});
</script>
