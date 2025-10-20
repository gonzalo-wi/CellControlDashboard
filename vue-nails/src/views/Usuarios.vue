<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
  <header class="bg-white shadow-sm dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestión de Usuarios</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Roturas y rotaciones por usuario</p>
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
              :disabled="usuariosConRoturas.length === 0"
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

      <!-- Resumen General -->
      <div v-if="todasRegiones && todasRegiones.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Resumen General</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Usuarios"
            :value="todosUsuariosRotos.length"
            icon="users"
            color="blue"
            subtitle="En el sistema"
          />
          <StatsCard 
            title="Con Roturas"
            :value="usuariosConRoturas.length"
            icon="alert"
            color="red"
            :subtitle="`${porcentajeConRoturas}% del total`"
          />
          <StatsCard 
            title="Total Roturas"
            :value="totalRoturas"
            icon="chart"
            color="orange"
            subtitle="Celulares rotos"
          />
          <StatsCard 
            title="Promedio por Usuario"
            :value="promedioRoturas"
            icon="clock"
            color="purple"
            subtitle="Roturas/usuario"
          />
        </div>
      </div>

      <!-- Top Usuarios con más roturas -->
      <div v-if="usuariosConRoturas.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Top Usuarios con Más Roturas</h2>
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    #
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Región
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Roturas
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                <tr 
                  v-for="(usuario, index) in top20Usuarios" 
                  :key="index"
                  class="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-150 cursor-pointer hover:shadow-sm"
                  :class="index < 3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent dark:from-yellow-900/10' : ''"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    <span 
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-all"
                      :class="index < 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    >
                      {{ index + 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ usuario.nombre }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatearRegion(usuario.region) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span 
                      class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                      :class="getRoturasClass(usuario.roturas)"
                    >
                      {{ usuario.roturas }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getNivelClass(usuario.roturas)"
                    >
                      {{ getNivel(usuario.roturas) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Usuarios por región -->
      <div v-if="regionesConUsuarios.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Usuarios por Región</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <CardContainer 
            v-for="region in regionesConUsuarios" 
            :key="region.nombre"
            :title="formatearRegion(region.nombre)"
            :subtitle="`${region.usuarios.length} usuarios con roturas`"
          >
            <div class="space-y-2">
              <div 
                v-for="(usuario, index) in region.usuarios.slice(0, 10)" 
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <span class="text-sm text-gray-700 truncate flex-1 dark:text-gray-300">{{ usuario.nombre }}</span>
                <span 
                  class="ml-2 px-2 py-1 text-xs font-bold rounded-full"
                  :class="getRoturasBadgeClass(usuario.roturas)"
                >
                  {{ usuario.roturas }}
                </span>
              </div>
              <div 
                v-if="region.usuarios.length > 10"
                class="text-center pt-2 border-t border-gray-200 dark:border-gray-800"
              >
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  y {{ region.usuarios.length - 10 }} usuario(s) más
                </span>
              </div>
            </div>
          </CardContainer>
        </div>
      </div>

      <!-- Distribución de roturas -->
      <div v-if="distribucionRoturas.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Distribución de Roturas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="rango in distribucionRoturas" 
            :key="rango.label"
            class="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-900"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ rango.label }}</p>
                <p class="text-3xl font-bold mt-2" :class="rango.color">{{ rango.cantidad }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ rango.porcentaje }}% del total</p>
              </div>
              <div 
                class="w-16 h-16 rounded-full flex items-center justify-center"
                :class="rango.bgColor"
              >
                <span class="text-2xl font-bold" :class="rango.color">{{ rango.cantidad }}</span>
              </div>
            </div>
          </div>
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

// Obtener todos los usuarios con roturas de todas las regiones
const todosUsuariosRotos = computed(() => {
  if (!todasRegiones.value) return [];
  
  const usuarios = [];
  todasRegiones.value.forEach(region => {
    if (region.celularesRotosPorUsuario) {
      Object.entries(region.celularesRotosPorUsuario).forEach(([nombre, roturas]) => {
        usuarios.push({
          nombre,
          roturas,
          region: region.region
        });
      });
    }
  });
  
  return usuarios;
});

// Filtrar usuarios con roturas > 0
const usuariosConRoturas = computed(() => {
  return todosUsuariosRotos.value.filter(u => u.roturas > 0);
});

// Top 20 usuarios con más roturas
const top20Usuarios = computed(() => {
  return [...usuariosConRoturas.value]
    .sort((a, b) => b.roturas - a.roturas)
    .slice(0, 20);
});

// Total de roturas
const totalRoturas = computed(() => {
  return usuariosConRoturas.value.reduce((sum, u) => sum + u.roturas, 0);
});

// Porcentaje de usuarios con roturas
const porcentajeConRoturas = computed(() => {
  if (todosUsuariosRotos.value.length === 0) return '0.0';
  return ((usuariosConRoturas.value.length / todosUsuariosRotos.value.length) * 100).toFixed(1);
});

// Promedio de roturas por usuario
const promedioRoturas = computed(() => {
  if (usuariosConRoturas.value.length === 0) return '0.0';
  return (totalRoturas.value / usuariosConRoturas.value.length).toFixed(1);
});

// Usuarios agrupados por región
const regionesConUsuarios = computed(() => {
  if (!todasRegiones.value) return [];
  
  return todasRegiones.value
    .map(region => {
      const usuarios = [];
      if (region.celularesRotosPorUsuario) {
        Object.entries(region.celularesRotosPorUsuario).forEach(([nombre, roturas]) => {
          if (roturas > 0) {
            usuarios.push({ nombre, roturas });
          }
        });
      }
      
      return {
        nombre: region.region,
        usuarios: usuarios.sort((a, b) => b.roturas - a.roturas)
      };
    })
    .filter(region => region.usuarios.length > 0)
    .sort((a, b) => b.usuarios.length - a.usuarios.length);
});

// Distribución de roturas por rangos
const distribucionRoturas = computed(() => {
  if (usuariosConRoturas.value.length === 0) return [];
  
  const rangos = [
    { label: '1 rotura', min: 1, max: 1, cantidad: 0, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: '2-3 roturas', min: 2, max: 3, cantidad: 0, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: '4-5 roturas', min: 4, max: 5, cantidad: 0, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: '6+ roturas', min: 6, max: 999, cantidad: 0, color: 'text-red-600', bgColor: 'bg-red-100' }
  ];
  
  usuariosConRoturas.value.forEach(usuario => {
    const rango = rangos.find(r => usuario.roturas >= r.min && usuario.roturas <= r.max);
    if (rango) rango.cantidad++;
  });
  
  const total = usuariosConRoturas.value.length;
  rangos.forEach(rango => {
    rango.porcentaje = ((rango.cantidad / total) * 100).toFixed(1);
  });
  
  return rangos;
});

// Funciones de estilo
const getRoturasClass = (roturas) => {
  if (roturas >= 6) return 'bg-red-100 text-red-800';
  if (roturas >= 4) return 'bg-orange-100 text-orange-800';
  if (roturas >= 2) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

const getRoturasBadgeClass = (roturas) => {
  if (roturas >= 6) return 'bg-red-600 text-white';
  if (roturas >= 4) return 'bg-orange-600 text-white';
  if (roturas >= 2) return 'bg-yellow-600 text-white';
  return 'bg-green-600 text-white';
};

const getNivelClass = (roturas) => {
  if (roturas >= 6) return 'bg-red-100 text-red-800';
  if (roturas >= 4) return 'bg-orange-100 text-orange-800';
  if (roturas >= 2) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

const getNivel = (roturas) => {
  if (roturas >= 6) return 'Crítico';
  if (roturas >= 4) return 'Alto';
  if (roturas >= 2) return 'Medio';
  return 'Bajo';
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

onMounted(() => {
  cargarDatos();
});

// Export to Excel
const exportarExcel = () => {
  const hojaUsuarios = usuariosConRoturas.value.map(u => ({
    Usuario: u.nombre,
    Región: formatearRegion(u.region),
    Roturas: u.roturas,
  }));

  const hojaTop20 = top20Usuarios.value.map((u, i) => ({
    Ranking: i + 1,
    Usuario: u.nombre,
    Región: formatearRegion(u.region),
    Roturas: u.roturas,
  }));

  exportToExcel({
    filename: `usuarios_${new Date().toISOString().slice(0,10)}.xlsx`,
    sheets: [
      { name: 'UsuariosConRoturas', data: hojaUsuarios },
      { name: 'Top20Usuarios', data: hojaTop20 },
    ]
  });
};
</script>
