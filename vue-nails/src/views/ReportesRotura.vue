<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white shadow-sm dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Reportes de Rotura
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Historial de celulares reportados como rotos
            </p>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <!-- Filtro de mes -->
            <div class="flex-1 sm:flex-initial">
              <input 
                type="month" 
                v-model="mesSeleccionado"
                @change="cargarDatos"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <button 
              @click="cargarDatos"
              :disabled="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
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
              :disabled="!reportes || reportes.length === 0"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              Exportar
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

      <!-- Estadísticas Resumen -->
      <div v-if="reportes && reportes.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90 font-medium">Total Roturas</p>
              <p class="text-3xl font-bold mt-1">{{ reportes.length }}</p>
            </div>
            <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90 font-medium">Con Templado</p>
              <p class="text-3xl font-bold mt-1">{{ estadisticas.conTemplado }}</p>
              <p class="text-xs opacity-80 mt-1">{{ ((estadisticas.conTemplado / reportes.length) * 100).toFixed(0) }}%</p>
            </div>
            <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90 font-medium">Con Funda</p>
              <p class="text-3xl font-bold mt-1">{{ estadisticas.conFunda }}</p>
              <p class="text-xs opacity-80 mt-1">{{ ((estadisticas.conFunda / reportes.length) * 100).toFixed(0) }}%</p>
            </div>
            <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90 font-medium">Regiones</p>
              <p class="text-3xl font-bold mt-1">{{ estadisticas.regiones.size }}</p>
              <p class="text-xs opacity-80 mt-1">afectadas</p>
            </div>
            <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Tabla de Reportes -->
      <div v-if="reportes && reportes.length > 0" class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 sticky top-0 z-10">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Celular
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Región
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Motivo
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Protección
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr 
                v-for="reporte in reportesPaginados" 
                :key="reporte.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ formatearFecha(reporte.fecha) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-semibold text-gray-900 dark:text-gray-100">
                      {{ reporte.celular.marca }} {{ reporte.celular.modelo }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Código: {{ reporte.celular.codigoInterno }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900 dark:text-gray-100">
                      {{ reporte.usuario.numReparto }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ reporte.usuario.numeroLinea }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    :class="getRegionClass(reporte.usuario.region)">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ formatearRegion(reporte.usuario.region) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600 dark:text-gray-300 max-w-md">
                    {{ extraerMotivo(reporte.descripcion) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span v-if="reporte.celular.tieneTemplado" 
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Templado
                    </span>
                    <span v-if="reporte.celular.tieneFunda" 
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Funda
                    </span>
                    <span v-if="!reporte.celular.tieneTemplado && !reporte.celular.tieneFunda"
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Sin protección
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span class="font-semibold">{{ (paginaActual - 1) * itemsPorPagina + 1 }}</span> a 
              <span class="font-semibold">{{ Math.min(paginaActual * itemsPorPagina, reportes.length) }}</span> de 
              <span class="font-semibold">{{ reportes.length }}</span> reportes
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="paginaActual--"
                :disabled="paginaActual === 1"
                class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Página {{ paginaActual }} de {{ totalPaginas }}
              </span>
              <button
                @click="paginaActual++"
                :disabled="paginaActual === totalPaginas"
                class="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 dark:text-gray-400">Cargando reportes...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && (!reportes || reportes.length === 0)" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No hay reportes</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          No se encontraron reportes de rotura para el mes seleccionado.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { exportToExcel } from '../utils/exportExcel';

const loading = ref(false);
const error = ref(null);
const reportes = ref([]);
const mesSeleccionado = ref('');
const paginaActual = ref(1);
const itemsPorPagina = 20;

// Inicializar con el mes actual
const inicializarMes = () => {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  mesSeleccionado.value = `${año}-${mes}`;
};

// Computed: Estadísticas
const estadisticas = computed(() => {
  if (!reportes.value || reportes.value.length === 0) {
    return {
      conTemplado: 0,
      conFunda: 0,
      regiones: new Set()
    };
  }

  return {
    conTemplado: reportes.value.filter(r => r.celular?.tieneTemplado).length,
    conFunda: reportes.value.filter(r => r.celular?.tieneFunda).length,
    regiones: new Set(reportes.value.map(r => r.usuario?.region).filter(Boolean))
  };
});

// Computed: Paginación
const totalPaginas = computed(() => {
  return Math.ceil((reportes.value?.length || 0) / itemsPorPagina);
});

const reportesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  return reportes.value?.slice(inicio, fin) || [];
});

// Cargar datos
const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  paginaActual.value = 1;
  
  try {
    const username = localStorage.getItem('auth_username') || 'admin';
    const password = localStorage.getItem('auth_password') || 'admin123';
    const credentials = btoa(`${username}:${password}`);

    const response = await axios.get('http://192.168.0.55:8082/api/movimientos/reportes-rotura', {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    let datos = response.data || [];

    // Filtrar por mes si está seleccionado
    if (mesSeleccionado.value) {
      const [año, mes] = mesSeleccionado.value.split('-');
      datos = datos.filter(r => {
        const fechaReporte = new Date(r.fecha);
        return fechaReporte.getFullYear() === parseInt(año) && 
               (fechaReporte.getMonth() + 1) === parseInt(mes);
      });
    }

    reportes.value = datos;
  } catch (err) {
    console.error('Error al cargar reportes:', err);
    error.value = err.response?.data?.message || err.message || 'Error al cargar los reportes de rotura';
  } finally {
    loading.value = false;
  }
};

// Formatear fecha
const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Formatear región
const formatearRegion = (region) => {
  if (!region) return 'N/A';
  return region.replace(/_/g, ' ');
};

// Extraer motivo de la descripción
const extraerMotivo = (descripcion) => {
  if (!descripcion) return 'Sin especificar';
  const match = descripcion.match(/Motivo:\s*(.+?)\./);
  return match ? match[1] : descripcion;
};

// Clase de región
const getRegionClass = (region) => {
  const clases = {
    'NORTE': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'SUR': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'LA_PLATA': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'OESTE': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
  };
  return clases[region] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
};

// Exportar a Excel
const exportarExcel = () => {
  if (!reportes.value || reportes.value.length === 0) return;

  const datos = reportes.value.map(r => ({
    'Fecha': formatearFecha(r.fecha),
    'Marca': r.celular?.marca || 'N/A',
    'Modelo': r.celular?.modelo || 'N/A',
    'Código': r.celular?.codigoInterno || 'N/A',
    'Usuario': r.usuario?.numReparto || 'N/A',
    'Teléfono': r.usuario?.numeroLinea || 'N/A',
    'Región': formatearRegion(r.usuario?.region),
    'Zona': r.usuario?.zona?.replace(/_/g, ' ') || 'N/A',
    'Motivo': extraerMotivo(r.descripcion),
    'Templado': r.celular?.tieneTemplado ? 'Sí' : 'No',
    'Funda': r.celular?.tieneFunda ? 'Sí' : 'No'
  }));

  const nombreArchivo = `reportes_rotura_${mesSeleccionado.value || 'todos'}.xlsx`;
  
  exportToExcel({
    filename: nombreArchivo,
    sheets: [
      {
        name: 'Reportes de Rotura',
        data: datos
      }
    ]
  });

  // Mostrar toast si existe
  if (window.$toast) {
    window.$toast.add({
      type: 'success',
      message: `Exportado: ${datos.length} reportes`
    });
  }
};

onMounted(() => {
  inicializarMes();
  cargarDatos();
});
</script>
