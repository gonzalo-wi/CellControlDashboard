<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-950">
    <!-- Header -->
    <header class="page-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Usuarios</h1>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Roturas y rotaciones por usuario</p>
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
              :disabled="usuariosConRoturas.length === 0"
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

      <!-- Resumen General -->
      <div v-if="usuarios.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Resumen General</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Usuarios"
            :value="usuarios.length"
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

      <!-- Filtros -->
      <div v-if="usuarios.length > 0" class="mb-6">
        <div class="card p-4">
          <div class="flex flex-wrap items-center gap-3">
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Región:</label>
            <select 
              v-model="regionFiltro"
              class="select-pro"
            >
              <option value="">Todas</option>
              <option v-for="r in regionesDisponibles" :key="r" :value="r">{{ formatearRegion(r) }}</option>
            </select>
            <input 
              v-model="busqueda"
              type="text"
              placeholder="Buscar usuario..."
              class="input-pro flex-1 min-w-[200px]"
            />
          </div>
        </div>
      </div>

      <!-- Top Usuarios con más roturas -->
      <div v-if="usuariosFiltrados.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Usuarios con Roturas
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">({{ usuariosFiltrados.length }})</span>
        </h2>
        <div class="card overflow-hidden">
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Zona
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Celular
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
                  v-for="(usuario, index) in usuariosPaginados" 
                  :key="index"
                  class="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-150 cursor-pointer hover:shadow-sm"
                  :class="globalIndex(index) < 3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent dark:from-yellow-900/10' : ''"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    <span 
                      class="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-all"
                      :class="globalIndex(index) < 3 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
                    >
                      {{ globalIndex(index) + 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ usuario.numReparto }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ usuario.cargo }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatearRegion(usuario.region) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ usuario.zona }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ usuario.marcaCelular }} {{ usuario.modeloCelular }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Serie: {{ usuario.numeroSerieCelular }}</div>
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
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getNivelClass(usuario.cantCelularesRotos)"
                    >
                      {{ getNivel(usuario.cantCelularesRotos) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
                <span class="font-medium">{{ Math.min(paginaActual * itemsPorPagina, usuariosFiltrados.length) }}</span>
                de
                <span class="font-medium">{{ usuariosFiltrados.length }}</span>
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
                <span class="text-sm text-gray-700 truncate flex-1 dark:text-gray-300">{{ usuario.numReparto }}</span>
                <span 
                  class="ml-2 px-2 py-1 text-xs font-bold rounded-full"
                  :class="getRoturasBadgeClass(usuario.cantCelularesRotos)"
                >
                  {{ usuario.cantCelularesRotos }}
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
            class="card p-6"
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
      <LoadingSpinner v-if="loading && usuarios.length === 0" label="Cargando datos..." />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import StatsCard from '../components/StatsCard.vue';
import CardContainer from '../components/CardContainer.vue';
import lineasService from '../services/lineasService';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { exportToExcel } from '../utils/exportExcel';

const loading = ref(false);
const error = ref(null);
const usuarios = ref([]);
const regionFiltro = ref('');
const busqueda = ref('');
const paginaActual = ref(1);
const itemsPorPagina = 20;

watch([regionFiltro, busqueda], () => {
  paginaActual.value = 1;
});

// Formatear nombre de región
const formatearRegion = (region) => {
  if (!region) return 'Sin región';
  return region.replace(/_/g, ' ').toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Regiones disponibles
const regionesDisponibles = computed(() => {
  const regiones = new Set(usuarios.value.map(u => u.region).filter(Boolean));
  return [...regiones].sort();
});

// Filtrar usuarios con roturas > 0
const usuariosConRoturas = computed(() => {
  return usuarios.value.filter(u => u.cantCelularesRotos > 0);
});

// Usuarios filtrados y ordenados
const usuariosFiltrados = computed(() => {
  let filtrados = [...usuariosConRoturas.value];
  
  if (regionFiltro.value) {
    filtrados = filtrados.filter(u => u.region === regionFiltro.value);
  }
  
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase();
    filtrados = filtrados.filter(u => 
      (u.numReparto && u.numReparto.toLowerCase().includes(q)) ||
      (u.zona && u.zona.toLowerCase().includes(q)) ||
      (u.region && u.region.toLowerCase().includes(q))
    );
  }
  
  return filtrados.sort((a, b) => b.cantCelularesRotos - a.cantCelularesRotos);
});

// Paginación
const totalPaginas = computed(() => 
  Math.ceil(usuariosFiltrados.value.length / itemsPorPagina)
);

const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina;
  return usuariosFiltrados.value.slice(inicio, inicio + itemsPorPagina);
});

const globalIndex = (localIndex) => {
  return (paginaActual.value - 1) * itemsPorPagina + localIndex;
};

// Total de roturas
const totalRoturas = computed(() => {
  return usuariosConRoturas.value.reduce((sum, u) => sum + u.cantCelularesRotos, 0);
});

// Porcentaje de usuarios con roturas
const porcentajeConRoturas = computed(() => {
  if (usuarios.value.length === 0) return '0.0';
  return ((usuariosConRoturas.value.length / usuarios.value.length) * 100).toFixed(1);
});

// Promedio de roturas por usuario
const promedioRoturas = computed(() => {
  if (usuariosConRoturas.value.length === 0) return '0.0';
  return (totalRoturas.value / usuariosConRoturas.value.length).toFixed(1);
});

// Usuarios agrupados por región
const regionesConUsuarios = computed(() => {
  const mapa = {};
  
  usuariosConRoturas.value.forEach(u => {
    const region = u.region || 'SIN_REGION';
    if (!mapa[region]) mapa[region] = [];
    mapa[region].push(u);
  });
  
  return Object.entries(mapa)
    .map(([nombre, usrs]) => ({
      nombre,
      usuarios: usrs.sort((a, b) => b.cantCelularesRotos - a.cantCelularesRotos)
    }))
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
    const rango = rangos.find(r => usuario.cantCelularesRotos >= r.min && usuario.cantCelularesRotos <= r.max);
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

onMounted(() => {
  cargarDatos();
});

// Export to Excel
const exportarExcel = () => {
  const hojaUsuarios = usuariosConRoturas.value
    .sort((a, b) => b.cantCelularesRotos - a.cantCelularesRotos)
    .map(u => ({
      Reparto: u.numReparto,
      Región: formatearRegion(u.region),
      Zona: u.zona,
      Línea: u.numeroLinea || 'Sin línea',
      Cargo: u.cargo,
      Celular: `${u.marcaCelular} ${u.modeloCelular}`,
      Serie: u.numeroSerieCelular,
      Roturas: u.cantCelularesRotos,
    }));

  exportToExcel({
    filename: `usuarios_${new Date().toISOString().slice(0,10)}.xlsx`,
    sheets: [
      { name: 'UsuariosConRoturas', data: hojaUsuarios },
    ]
  });
};
</script>
