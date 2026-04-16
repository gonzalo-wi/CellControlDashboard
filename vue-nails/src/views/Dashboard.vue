<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950">
    <!-- Header -->
    <header class="page-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard</h1>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Resumen general de gestión de celulares</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="cargarDatos"
              :disabled="loading"
              class="btn-primary"
            >
              <svg 
                class="w-4 h-4" 
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
              :disabled="!estadisticasTotales && (!todasRegiones || todasRegiones.length === 0)"
              class="btn-success"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              Exportar
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error Message -->
      <div v-if="error" class="mb-6 card border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
            <svg class="h-4 w-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-red-700 dark:text-red-300">{{ error }}</p>
        </div>
      </div>

      <!-- Filtros de Fecha -->
      <div class="mb-6 card p-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fecha Desde</label>
            <input 
              type="date" 
              v-model="fechaDesde"
              class="input-pro"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Fecha Hasta</label>
            <input 
              type="date" 
              v-model="fechaHasta"
              class="input-pro"
            />
          </div>
          <div class="flex items-end">
            <button 
              @click="aplicarFiltros"
              class="btn-primary w-full"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas Generales -->
      <div v-if="!loading && estadisticasGenerales" class="mb-8">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
          <span class="w-1 h-8 bg-gradient-to-b from-brand-500 to-brand-700 rounded-full"></span>
          Estadísticas Generales
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Dispositivos"
            :value="estadisticasGenerales.totalDispositivos || 0"
            icon="phone"
            color="blue"
            subtitle="En el sistema"
            class="stagger-1"
          />
          <StatsCard 
            title="Dispositivos Asignados"
            :value="estadisticasGenerales.totalAsignados || 0"
            icon="check"
            color="green"
            subtitle="Asignados a usuarios"
            class="stagger-2"
          />
          <StatsCard 
            title="Total Usuarios"
            :value="estadisticasGenerales.totalUsuarios || 0"
            icon="users"
            color="purple"
            subtitle="Registrados"
            class="stagger-3"
          />
          <StatsCard 
            title="Total Movimientos"
            :value="estadisticasGenerales.totalMovimientos || 0"
            icon="chart"
            color="red"
            subtitle="Registrados"
            class="stagger-4"
          />
        </div>
      </div>

      <!-- Skeleton loading generales -->
      <div v-if="loading && !estadisticasGenerales" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
          <span class="w-1 h-8 bg-gradient-to-b from-brand-500 to-brand-700 rounded-full"></span>
          Estadísticas Generales
        </h2>
        <SkeletonCards :count="4" />
      </div>

      <!-- Estadísticas Totales -->
      <div v-if="!loading && estadisticasTotales" class="mb-8">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
          <span class="w-1 h-8 bg-gradient-to-b from-brand-500 to-brand-700 rounded-full"></span>
          Actividad
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Movimientos"
            :value="estadisticasTotales.totalMovimientos || 0"
            icon="phone"
            color="blue"
            subtitle="Registrados"
            class="stagger-1"
          />
          <StatsCard 
            title="Total Solicitudes"
            :value="estadisticasTotales.totalSolicitudes || 0"
            icon="chart"
            color="green"
            subtitle="Registradas"
            class="stagger-2"
          />
          <StatsCard 
            title="Movimientos Mes Actual"
            :value="estadisticasTotales.movimientosMesActual || 0"
            icon="clock"
            color="purple"
            subtitle="Este mes"
            class="stagger-3"
          />
          <StatsCard 
            title="Solicitudes Mes Actual"
            :value="estadisticasTotales.solicitudesMesActual || 0"
            icon="alert"
            color="red"
            subtitle="Este mes"
            class="stagger-4"
          />
        </div>
      </div>
      
      <!-- Skeleton loading actividad -->
      <div v-if="loading && !estadisticasTotales" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
          <span class="w-1 h-8 bg-gradient-to-b from-brand-500 to-brand-700 rounded-full"></span>
          Actividad
        </h2>
        <SkeletonCards :count="4" />
      </div>

      <!-- Estadísticas Detalladas de Celulares -->
      <div v-if="todosCelulares && todosCelulares.length > 0" class="mb-8">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">Análisis de Celulares</h2>
        <EstadisticasCelulares :celulares="todosCelulares" />
      </div>

      <!-- Estadísticas de Celulares Rotos -->
      <div v-if="todasRegiones && todasRegiones.length > 0" class="mb-8">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">Resumen de Roturas</h2>
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
      <div v-if="todasRegiones && todasRegiones.length > 0" class="mb-8">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">Estadísticas por Región</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardContainer 
            v-for="region in regionesConDatos" 
            :key="region.region || 'sin-region'"
            :title="formatearRegion(region.region)"
            :subtitle="`${region.totalUsuarios} usuarios • ${region.totalSolicitudes} solicitudes`"
          >
            <div class="space-y-4">
              <!-- KPIs principales -->
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ region.totalUsuarios || 0 }}</p>
                  <p class="text-xs text-gray-600 mt-1 dark:text-gray-300">Usuarios</p>
                </div>
                <div class="text-center p-3 bg-red-50 rounded-lg dark:bg-red-900/20">
                  <p class="text-2xl font-bold text-red-600 dark:text-red-300">{{ calcularRotosRegion(region) }}</p>
                  <p class="text-xs text-gray-600 mt-1 dark:text-gray-300">Rotos</p>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <p class="text-2xl font-bold text-green-600 dark:text-green-300">{{ region.totalSolicitudes || 0 }}</p>
                  <p class="text-xs text-gray-600 mt-1 dark:text-gray-300">Solicitudes</p>
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
      <LoadingSpinner v-if="loading && !estadisticasTotales" label="Cargando datos..." />

      <!-- Empty State -->
      <div v-if="!loading && (!todasRegiones || todasRegiones.length === 0) && !error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay datos disponibles</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Intenta actualizar o verificar la conexión con la API.</p>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import StatsCard from '../components/StatsCard.vue';
import CardContainer from '../components/CardContainer.vue';
import EstadisticasCelulares from '../components/EstadisticasCelulares.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import SkeletonCards from '../components/SkeletonCards.vue';
import estadisticasService from '../services/estadisticasService';
import { exportToExcel } from '../utils/exportExcel';

// Estado reactivo
const loading = ref(false);
const error = ref(null);
const fechaDesde = ref('');
const fechaHasta = ref('');

// Datos
const estadisticasGenerales = ref(null);
const estadisticasTotales = ref(null);
const todasRegiones = ref([]);
const todosCelulares = ref([]);

// Formatear fecha
const formatFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

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

const calcularRotosRegion = (region) => {
  if (!region.celularesRotosPorUsuario) return 0;
  return Object.values(region.celularesRotosPorUsuario).reduce((sum, v) => sum + (v || 0), 0);
};

const calcularTotalRotos = () => {
  if (!todasRegiones.value) return 0;
  return todasRegiones.value.reduce((sum, r) => sum + calcularRotosRegion(r), 0);
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

// Cargar datos desde la API
const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Asegurar credenciales Basic antes de llamar a la API
    const username = localStorage.getItem('auth_username') || 'admin';
    const password = localStorage.getItem('auth_password') || 'admin123';
    estadisticasService.setBasicAuth(username, password);

    // Cargar estadísticas generales
    const responseGenerales = await estadisticasService.obtenerEstadisticasGenerales();
    estadisticasGenerales.value = responseGenerales.data;

    // Cargar estadísticas totales
    const responseTotales = await estadisticasService.obtenerEstadisticasTotales();
    estadisticasTotales.value = responseTotales.data;

    // Cargar estadísticas de todas las regiones
    const responseRegiones = await estadisticasService.obtenerEstadisticasTodasRegiones();
    const rawRegiones = responseRegiones.data;
    todasRegiones.value = Array.isArray(rawRegiones) ? rawRegiones : (Array.isArray(rawRegiones?.content) ? rawRegiones.content : []);

    // Cargar todos los celulares
    try {
      const responseCelulares = await estadisticasService.obtenerTodosCelulares();
      const rawCelulares = responseCelulares.data;
      todosCelulares.value = Array.isArray(rawCelulares) ? rawCelulares : (Array.isArray(rawCelulares?.content) ? rawCelulares.content : []);
    } catch (celularesError) {
      console.warn('No se pudieron cargar los celulares:', celularesError);
      // No es crítico, continuamos
    }

  } catch (err) {
    console.error('Error al cargar datos:', err);
    
    if (err.response?.status === 401) {
      error.value = 'Error de autenticación. Verifica tus credenciales.';
      if (window.$toast) {
        window.$toast.error('Error de autenticación', 'Verifica tus credenciales');
      }
    } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
      error.value = 'No se puede conectar con el servidor. Verifica que esté activo.';
      if (window.$toast) {
        window.$toast.error('Error de conexión', 'No se puede conectar con el servidor');
      }
    } else {
      error.value = `Error al cargar datos: ${err.message}`;
      if (window.$toast) {
        window.$toast.error('Error', 'No se pudieron cargar los datos');
      }
    }
  } finally {
    loading.value = false;
  }
};

// Aplicar filtros de fecha
const aplicarFiltros = async () => {
  if (!fechaDesde.value || !fechaHasta.value) {
    alert('Por favor selecciona ambas fechas');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const responseRegiones = await estadisticasService.obtenerEstadisticasMiRegion(
      null, 
      fechaDesde.value, 
      fechaHasta.value
    );
    
    // Si obtuvimos datos para una región específica, actualizar
    if (responseRegiones.data) {
      todasRegiones.value = [responseRegiones.data];
    }
  } catch (err) {
    console.error('Error al aplicar filtros:', err);
    error.value = 'Error al aplicar filtros. Verifica las fechas seleccionadas.';
  } finally {
    loading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatos();
});

// Export to Excel (resumen + por región)
const exportarExcel = () => {
  const resumen = estadisticasGenerales.value ? [{
    TotalDispositivos: estadisticasGenerales.value.totalDispositivos || 0,
    TotalAsignados: estadisticasGenerales.value.totalAsignados || 0,
    TotalUsuarios: estadisticasGenerales.value.totalUsuarios || 0,
    TotalMovimientos: estadisticasTotales.value?.totalMovimientos || 0,
    TotalSolicitudes: estadisticasTotales.value?.totalSolicitudes || 0,
    MovimientosMesActual: estadisticasTotales.value?.movimientosMesActual || 0,
    SolicitudesMesActual: estadisticasTotales.value?.solicitudesMesActual || 0,
  }] : [];

  const regiones = (todasRegiones.value || []).map(r => ({
    Region: formatearRegion(r.region),
    Usuarios: r.totalUsuarios || 0,
    CelularesRotos: calcularRotosRegion(r),
    Solicitudes: r.totalSolicitudes || 0,
    PromedioRoturasUsuario: r.promedioCelularesRotos || 0,
  }));

  exportToExcel({
    filename: `dashboard_${new Date().toISOString().slice(0,10)}.xlsx`,
    sheets: [
      { name: 'Resumen', data: resumen },
      { name: 'Regiones', data: regiones }
    ]
  });
  
  // Show success toast
  if (window.$toast) {
    window.$toast.success('Excel exportado', 'El archivo se descargó correctamente');
  }
};
</script>
