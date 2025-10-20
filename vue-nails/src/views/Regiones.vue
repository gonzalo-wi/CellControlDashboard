<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
  <header class="bg-white shadow-sm dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Regiones</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Estadísticas y roturas por región</p>
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
              :disabled="regionesConDatos.length === 0"
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

      <!-- Resumen de Roturas -->
      <div v-if="todasRegiones && todasRegiones.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Resumen General</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Usuarios"
            :value="calcularTotalUsuarios()"
            icon="users"
            color="blue"
            subtitle="En todas las regiones"
          />
          <StatsCard 
            title="Total Celulares Rotos"
            :value="calcularTotalRotos()"
            icon="alert"
            color="red"
            subtitle="Requieren atención"
          />
          <StatsCard 
            title="Total Solicitudes"
            :value="calcularTotalSolicitudes()"
            icon="chart"
            color="green"
            subtitle="Registradas"
          />
          <StatsCard 
            title="Promedio Roturas"
            :value="`${calcularPromedioRoturas()}%`"
            icon="clock"
            color="purple"
            subtitle="Por usuario"
          />
        </div>
      </div>

      <!-- Estadísticas por Región -->
      <div v-if="regionesConDatos && regionesConDatos.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Estadísticas por Región</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardContainer 
            v-for="region in regionesConDatos" 
            :key="region.region"
            :title="formatearRegion(region.region)"
            :subtitle="`${region.totalUsuarios} usuarios • ${region.totalSolicitudes} solicitudes`"
          >
            <div class="space-y-4">
              <!-- KPIs principales -->
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600">{{ region.totalUsuarios || 0 }}</p>
                  <p class="text-xs text-gray-600 mt-1">Usuarios</p>
                </div>
                <div class="text-center p-3 bg-red-50 rounded-lg">
                  <p class="text-2xl font-bold text-red-600">{{ region.totalCelularesRotos || 0 }}</p>
                  <p class="text-xs text-gray-600 mt-1">Rotos</p>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <p class="text-2xl font-bold text-green-600">{{ region.totalSolicitudes || 0 }}</p>
                  <p class="text-xs text-gray-600 mt-1">Solicitudes</p>
                </div>
              </div>

              <!-- Promedio de roturas -->
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Promedio Roturas/Usuario</span>
                <span class="text-lg font-bold" :class="getPromedioColor(region.promedioCelularesRotos)">
                  {{ (region.promedioCelularesRotos * 100).toFixed(1) }}%
                </span>
              </div>

              <!-- Solicitudes por estado -->
              <div v-if="region.solicitudesPorEstado" class="space-y-2">
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Estado de Solicitudes</p>
                <div class="grid grid-cols-3 gap-2">
                  <div 
                    v-for="(cantidad, estado) in region.solicitudesPorEstado" 
                    :key="estado"
                    class="text-center p-2 rounded"
                    :class="getEstadoClass(estado)"
                  >
                    <p class="text-lg font-bold">{{ cantidad }}</p>
                    <p class="text-xs mt-1">{{ formatearEstado(estado) }}</p>
                  </div>
                </div>
              </div>

              <!-- Top usuarios con más roturas -->
              <div v-if="getTopUsuariosRotos(region.celularesRotosPorUsuario).length > 0" class="pt-3 border-t border-gray-200 dark:border-gray-800">
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Top Usuarios con Roturas</p>
                <div class="space-y-2">
                  <div 
                    v-for="(usuario, index) in getTopUsuariosRotos(region.celularesRotosPorUsuario)" 
                    :key="index"
                    class="flex items-center justify-between p-2 bg-red-50 rounded dark:bg-red-900/20"
                  >
                    <span class="text-sm text-gray-700 truncate flex-1 dark:text-gray-300">{{ usuario.nombre }}</span>
                    <span class="ml-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                      {{ usuario.roturas }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Solicitudes por mes -->
              <div v-if="region.solicitudesPorMes && Object.keys(region.solicitudesPorMes).length > 0" class="pt-3 border-t border-gray-200 dark:border-gray-800">
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Solicitudes por Mes</p>
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="(cantidad, mes) in region.solicitudesPorMes" 
                    :key="mes"
                    class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-300"
                  >
                    {{ formatearMes(mes) }}: {{ cantidad }}
                  </div>
                </div>
              </div>
            </div>
          </CardContainer>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading && !todasRegiones" label="Cargando datos..." />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import StatsCard from '../components/StatsCard.vue';
import CardContainer from '../components/CardContainer.vue';
import estadisticasService from '../services/estadisticasService';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { exportToExcel } from '../utils/exportExcel';

const loading = ref(false);
const error = ref(null);
const todasRegiones = ref([]);

// Formatear nombre de región
const formatearRegion = (region) => {
  if (!region) return 'Sin región';
  return region.replace(/_/g, ' ').toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Formatear estado
const formatearEstado = (estado) => {
  const estados = {
    'RESUELTA': 'Resuelta',
    'PENDIENTE': 'Pendiente',
    'EN_PROCESO': 'En Proceso'
  };
  return estados[estado] || estado;
};

// Formatear mes
const formatearMes = (mes) => {
  const [year, month] = mes.split('-');
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${meses[parseInt(month) - 1]} ${year}`;
};

// Obtener clase de color según el promedio
const getPromedioColor = (promedio) => {
  if (promedio > 0.5) return 'text-red-600';
  if (promedio > 0.2) return 'text-yellow-600';
  return 'text-green-600';
};

// Obtener clase según estado
const getEstadoClass = (estado) => {
  const classes = {
    'RESUELTA': 'bg-green-100 text-green-800',
    'PENDIENTE': 'bg-yellow-100 text-yellow-800',
    'EN_PROCESO': 'bg-blue-100 text-blue-800'
  };
  return classes[estado] || 'bg-gray-100 text-gray-800';
};

// Obtener top 5 usuarios con más roturas
const getTopUsuariosRotos = (celularesRotosPorUsuario) => {
  if (!celularesRotosPorUsuario) return [];
  
  return Object.entries(celularesRotosPorUsuario)
    .filter(([_, roturas]) => roturas > 0)
    .map(([nombre, roturas]) => ({ nombre, roturas }))
    .sort((a, b) => b.roturas - a.roturas)
    .slice(0, 5);
};

// Filtrar regiones con datos
const regionesConDatos = computed(() => {
  if (!todasRegiones.value) return [];
  return todasRegiones.value.filter(region => 
    region.totalUsuarios > 0 || region.totalSolicitudes > 0
  );
});

// Calcular totales
const calcularTotalUsuarios = () => {
  if (!todasRegiones.value) return 0;
  return todasRegiones.value.reduce((sum, r) => sum + (r.totalUsuarios || 0), 0);
};

const calcularTotalRotos = () => {
  if (!todasRegiones.value) return 0;
  return todasRegiones.value.reduce((sum, r) => sum + (r.totalCelularesRotos || 0), 0);
};

const calcularTotalSolicitudes = () => {
  if (!todasRegiones.value) return 0;
  return todasRegiones.value.reduce((sum, r) => sum + (r.totalSolicitudes || 0), 0);
};

const calcularPromedioRoturas = () => {
  const totalUsuarios = calcularTotalUsuarios();
  const totalRotos = calcularTotalRotos();
  if (totalUsuarios === 0) return '0.0';
  return ((totalRotos / totalUsuarios) * 100).toFixed(1);
};

const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const username = localStorage.getItem('auth_username') || 'admin';
    const password = localStorage.getItem('auth_password') || 'admin123';
    estadisticasService.setBasicAuth(username, password);

    const response = await estadisticasService.obtenerEstadisticasTodasRegiones();
    todasRegiones.value = response.data;
  } catch (err) {
    console.error('Error al cargar regiones:', err);
    
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

const exportarExcel = () => {
  const regiones = (regionesConDatos.value || []).map(r => ({
    Region: formatearRegion(r.region),
    Usuarios: r.totalUsuarios || 0,
    CelularesRotos: r.totalCelularesRotos || 0,
    Solicitudes: r.totalSolicitudes || 0,
    PromedioRoturasUsuario: r.promedioCelularesRotos || 0,
  }));

  exportToExcel({
    filename: `regiones_${new Date().toISOString().slice(0,10)}.xlsx`,
    sheets: [
      { name: 'Regiones', data: regiones }
    ]
  });
};
</script>
