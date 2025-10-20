<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white shadow-sm dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard de Reparaciones</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Gestión de órdenes, proveedores y costos
            </p>
          </div>
          <div class="flex items-center gap-3">
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

      <!-- Alertas de Órdenes Vencidas -->
      <div v-if="alertas && alertas.totalVencidas > 0" class="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded dark:bg-yellow-900/30 dark:border-yellow-600">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              ¡Atención! Hay {{ alertas.totalVencidas }} órdenes vencidas que requieren seguimiento.
            </p>
          </div>
        </div>
      </div>

      <!-- KPIs Principales -->
      <div v-if="dashboard" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Resumen General</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Proveedores Activos"
            :value="dashboard.proveedoresActivos || 0"
            icon="building"
            color="blue"
          />
          <StatsCard 
            title="Órdenes por Estado"
            :value="contarOrdenesTotal(dashboard.ordenesPorEstado)"
            icon="chart"
            color="green"
          />
          <StatsCard 
            title="Órdenes Vencidas"
            :value="dashboard.ordenesVencidas || 0"
            icon="alert"
            color="red"
          />
          <StatsCard 
            title="Proveedores con Órdenes"
            :value="(dashboard.costosPorProveedor || []).length"
            icon="users"
            color="purple"
          />
        </div>
      </div>

      <!-- Estadísticas de Proveedores y Órdenes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Proveedores -->
        <CardContainer 
          v-if="proveedores"
          title="Estadísticas de Proveedores"
          subtitle="Información general"
        >
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Proveedores</span>
              <span class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ proveedores.totalProveedores || 0 }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Proveedores Activos</span>
              <span class="text-2xl font-bold text-green-600 dark:text-green-300">{{ proveedores.proveedoresActivos || 0 }}</span>
            </div>
          </div>
        </CardContainer>

        <!-- Órdenes -->
        <CardContainer 
          v-if="ordenes"
          title="Estadísticas de Órdenes"
          subtitle="Estado actual"
        >
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Órdenes</span>
              <span class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ ordenes.totalOrdenes || 0 }}</span>
            </div>
            <div v-if="ordenes.ordenesPorEstado" class="space-y-2">
              <div 
                v-for="(cantidad, estado) in ordenes.ordenesPorEstado" 
                :key="estado"
                class="flex justify-between items-center p-2 bg-white border border-gray-200 rounded dark:bg-gray-900 dark:border-gray-800"
              >
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ estado }}</span>
                <span class="font-semibold text-gray-900 dark:text-gray-100">{{ cantidad }}</span>
              </div>
            </div>
          </div>
        </CardContainer>
      </div>

      <!-- Costos por Proveedor -->
      <CardContainer 
        v-if="dashboard && dashboard.costosPorProveedor && dashboard.costosPorProveedor.length > 0"
        title="Costos por Proveedor"
        subtitle="Ranking de proveedores por costo total"
        class="mb-8"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proveedor</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Costo Total</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cantidad Órdenes</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              <tr v-for="(proveedor, index) in dashboard.costosPorProveedor" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ proveedor[0] || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600 dark:text-green-300">
                  ${{ formatearNumero(proveedor[1]) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-300">
                  {{ proveedor[2] || 0 }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContainer>

      <!-- Reparaciones Más Comunes -->
      <CardContainer 
        v-if="reparacionesComunes && reparacionesComunes.length > 0"
        title="Reparaciones Más Comunes"
        subtitle="Tipos de reparación más frecuentes"
        class="mb-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(reparacion, index) in reparacionesComunes" 
            :key="index"
            class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-900/40"
          >
            <p class="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">{{ reparacion[0] || 'Sin tipo' }}</p>
            <div class="flex justify-between items-end">
              <div>
                <p class="text-xs text-gray-600 dark:text-gray-400">Cantidad</p>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-300">{{ reparacion[1] || 0 }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-600 dark:text-gray-400">Costo Total</p>
                <p class="text-lg font-semibold text-green-600 dark:text-green-300">${{ formatearNumero(reparacion[2]) }}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContainer>

      <!-- Órdenes Vencidas Detalle -->
      <CardContainer 
        v-if="alertas && alertas.ordenesVencidas && alertas.ordenesVencidas.length > 0"
        title="Órdenes Vencidas - Detalle"
        :subtitle="`${alertas.totalVencidas} órdenes requieren atención`"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">N° Orden</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proveedor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha Estimada</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              <tr v-for="orden in alertas.ordenesVencidas" :key="orden.id" class="hover:bg-red-50 dark:hover:bg-red-900/10">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ orden.numeroOrden }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {{ orden.proveedor }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {{ formatearFecha(orden.fechaEstimada) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                    Vencida
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContainer>

      <!-- Loading State -->
      <div v-if="loading && !dashboard" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-gray-600 dark:text-gray-300">Cargando datos...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatsCard from '../components/StatsCard.vue';
import CardContainer from '../components/CardContainer.vue';
import dashboardService from '../services/dashboardService';

// Estado reactivo
const loading = ref(false);
const error = ref(null);
// (Se removió la configuración de API visible para simplificar la UI)

// Datos
const dashboard = ref(null);
const proveedores = ref(null);
const ordenes = ref(null);
const items = ref(null);
const reparacionesComunes = ref(null);
const alertas = ref(null);

// Formatear número con separador de miles
const formatearNumero = (numero) => {
  if (!numero) return '0';
  return new Intl.NumberFormat('es-ES').format(numero);
};

// Formatear fecha
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

// Contar total de órdenes
const contarOrdenesTotal = (ordenesPorEstado) => {
  if (!ordenesPorEstado) return 0;
  return Object.values(ordenesPorEstado).reduce((sum, val) => sum + val, 0);
};

// Cargar todos los datos
const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Cargar credenciales guardadas
    const username = localStorage.getItem('auth_username') || 'admin';
    const password = localStorage.getItem('auth_password') || 'admin123';
    dashboardService.setBasicAuth(username, password);

    // Cargar datos en paralelo
    const [
      dashboardRes,
      proveedoresRes,
      ordenesRes,
      itemsRes,
      reparacionesComunesRes,
      alertasRes
    ] = await Promise.all([
      dashboardService.obtenerDashboard(),
      dashboardService.obtenerEstadisticasProveedores(),
      dashboardService.obtenerEstadisticasOrdenes(),
      dashboardService.obtenerEstadisticasItems(),
      dashboardService.obtenerReparacionesComunes(),
      dashboardService.obtenerAlertas()
    ]);

    dashboard.value = dashboardRes.data;
    proveedores.value = proveedoresRes.data;
    ordenes.value = ordenesRes.data;
    items.value = itemsRes.data;
    reparacionesComunes.value = reparacionesComunesRes.data;
    alertas.value = alertasRes.data;

  } catch (err) {
    console.error('Error al cargar datos:', err);
    
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

// Cargar datos al montar
onMounted(() => {
  cargarDatos();
});
</script>
