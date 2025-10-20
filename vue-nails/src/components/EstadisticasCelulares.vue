<template>
  <div class="space-y-6">
    <!-- Resumen de Celulares -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Total Celulares</p>
            <p class="text-3xl font-bold mt-1">{{ stats.total }}</p>
          </div>
          <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Nuevos</p>
            <p class="text-3xl font-bold mt-1">{{ stats.nuevos }}</p>
            <p class="text-xs opacity-80 mt-1">{{ ((stats.nuevos / stats.total) * 100).toFixed(1) }}%</p>
          </div>
          <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">En Uso</p>
            <p class="text-3xl font-bold mt-1">{{ stats.enUso }}</p>
            <p class="text-xs opacity-80 mt-1">{{ ((stats.enUso / stats.total) * 100).toFixed(1) }}%</p>
          </div>
          <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Con Roturas</p>
            <p class="text-3xl font-bold mt-1">{{ stats.conRoturas }}</p>
            <p class="text-xs opacity-80 mt-1">{{ ((stats.conRoturas / stats.total) * 100).toFixed(1) }}%</p>
          </div>
          <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Distribución por Marca y Modelo -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Por Marca -->
      <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">Distribución por Marca</h3>
        <div class="space-y-3">
          <div 
            v-for="(cantidad, marca) in stats.porMarca" 
            :key="marca"
            class="flex items-center"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ marca }}</span>
                <span class="text-sm font-bold text-gray-900 dark:text-gray-200">{{ cantidad }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="{ width: `${(cantidad / stats.total) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Modelos -->
      <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">Top 10 Modelos</h3>
        <div class="space-y-2">
          <div 
            v-for="(modelo, index) in stats.topModelos" 
            :key="index"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors dark:hover:bg-gray-800"
          >
            <div class="flex items-center gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold dark:bg-blue-900/40 dark:text-blue-300">
                {{ index + 1 }}
              </span>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ modelo.marca }} {{ modelo.modelo }}</span>
            </div>
            <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold dark:bg-blue-900/30 dark:text-blue-300">
              {{ modelo.cantidad }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Accesorios - Diseño mejorado -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Templados Card -->
      <div class="group relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-200 dark:border-emerald-800">
        <!-- Decorative background -->
        <div class="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div class="relative z-10 p-8">
          <!-- Header con icono -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Protección de Pantalla</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Vidrio Templado</p>
              </div>
            </div>
          </div>

          <!-- Gráfico circular mejorado -->
          <div class="flex items-center justify-between gap-8">
            <!-- Chart -->
            <div class="relative flex-shrink-0">
              <svg class="w-48 h-48 transform -rotate-90 drop-shadow-lg">
                <!-- Background circle -->
                <circle 
                  cx="96" 
                  cy="96" 
                  r="80" 
                  :stroke="isDark ? '#1F2937' : '#F3F4F6'" 
                  stroke-width="16" 
                  fill="none" 
                  opacity="0.3"
                />
                <!-- Progress circle con gradiente -->
                <defs>
                  <linearGradient id="templadoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#14B8A6;stop-opacity:1" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle 
                  cx="96" 
                  cy="96" 
                  r="80" 
                  stroke="url(#templadoGradient)"
                  stroke-width="16" 
                  fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="`${(stats.conTemplado / stats.total) * 502.65}, 502.65`"
                  class="transition-all duration-[1500ms] ease-out"
                  style="filter: url(#glow)"
                />
              </svg>
              <!-- Center percentage -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-black bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {{ ((stats.conTemplado / stats.total) * 100).toFixed(1) }}%
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Cobertura</span>
              </div>
            </div>

            <!-- Stats breakdown -->
            <div class="flex-1 space-y-4">
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/50">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Con Templado</span>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {{ ((stats.conTemplado / stats.total) * 100).toFixed(1) }}%
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm"></div>
                  <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.conTemplado }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">dispositivos</span>
                </div>
              </div>

              <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Sin Templado</span>
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-400">
                    {{ ((stats.sinTemplado / stats.total) * 100).toFixed(1) }}%
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 shadow-sm"></div>
                  <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.sinTemplado }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">dispositivos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fundas Card -->
      <div class="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-200 dark:border-blue-800">
        <!-- Decorative background -->
        <div class="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div class="relative z-10 p-8">
          <!-- Header con icono -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Protección Física</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Fundas y Cases</p>
              </div>
            </div>
          </div>

          <!-- Gráfico circular mejorado -->
          <div class="flex items-center justify-between gap-8">
            <!-- Chart -->
            <div class="relative flex-shrink-0">
              <svg class="w-48 h-48 transform -rotate-90 drop-shadow-lg">
                <!-- Background circle -->
                <circle 
                  cx="96" 
                  cy="96" 
                  r="80" 
                  :stroke="isDark ? '#1F2937' : '#F3F4F6'" 
                  stroke-width="16" 
                  fill="none" 
                  opacity="0.3"
                />
                <!-- Progress circle con gradiente -->
                <defs>
                  <linearGradient id="fundaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#6366F1;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle 
                  cx="96" 
                  cy="96" 
                  r="80" 
                  stroke="url(#fundaGradient)"
                  stroke-width="16" 
                  fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="`${(stats.conFunda / stats.total) * 502.65}, 502.65`"
                  class="transition-all duration-[1500ms] ease-out"
                  style="filter: url(#glow)"
                />
              </svg>
              <!-- Center percentage -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ ((stats.conFunda / stats.total) * 100).toFixed(1) }}%
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Cobertura</span>
              </div>
            </div>

            <!-- Stats breakdown -->
            <div class="flex-1 space-y-4">
              <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Con Funda</span>
                  <span class="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {{ ((stats.conFunda / stats.total) * 100).toFixed(1) }}%
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm"></div>
                  <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.conFunda }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">dispositivos</span>
                </div>
              </div>

              <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Sin Funda</span>
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-400">
                    {{ ((stats.sinFunda / stats.total) * 100).toFixed(1) }}%
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 shadow-sm"></div>
                  <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.sinFunda }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">dispositivos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  celulares: {
    type: Array,
    required: true,
    default: () => []
  }
});

const stats = computed(() => {
  const celulares = props.celulares || [];
  
  // Estadísticas básicas
  const total = celulares.length;
  const nuevos = celulares.filter(c => c.estado === 'NUEVO').length;
  // En Uso: todos los que tienen una asignación
  const enUso = celulares.filter(c => {
    if (!c.usuario) return false;
    // Si es string, verificar que no esté vacío
    if (typeof c.usuario === 'string') {
      return c.usuario.trim() !== '';
    }
    // Si es objeto, verificar que exista (puede tener id, nombre, etc.)
    return true;
  }).length;
  const conRoturas = celulares.filter(c => c.cantRoturas > 0).length;
  
  // Accesorios
  const conTemplado = celulares.filter(c => c.tieneTemplado).length;
  const sinTemplado = total - conTemplado;
  const conFunda = celulares.filter(c => c.tieneFunda).length;
  const sinFunda = total - conFunda;
  
  // Por marca - Normalizado para evitar duplicados por mayúsculas/espacios
  const porMarca = celulares.reduce((acc, cel) => {
    const marca = (cel.marca || 'SIN MARCA').trim();
    acc[marca] = (acc[marca] || 0) + 1;
    return acc;
  }, {});
  
  // Ordenar por cantidad descendente
  const porMarcaOrdenado = Object.fromEntries(
    Object.entries(porMarca).sort((a, b) => b[1] - a[1])
  );
  
  // Top modelos - Agrupación mejorada sin duplicados
  const modelosCount = celulares.reduce((acc, cel) => {
    // Normalizar marca y modelo (eliminar espacios extras, convertir a mayúsculas)
    const marcaNormalizada = (cel.marca || 'SIN MARCA').trim().toUpperCase();
    const modeloNormalizado = (cel.modelo || 'SIN MODELO').trim().toUpperCase();
    const key = `${marcaNormalizada}|||${modeloNormalizado}`;
    
    if (!acc[key]) {
      acc[key] = { 
        marca: cel.marca || 'SIN MARCA', 
        modelo: cel.modelo || 'SIN MODELO', 
        cantidad: 0 
      };
    }
    acc[key].cantidad++;
    return acc;
  }, {});
  
  const topModelos = Object.values(modelosCount)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);
  
  return {
    total,
    nuevos,
    enUso,
    conRoturas,
    conTemplado,
    sinTemplado,
    conFunda,
    sinFunda,
    porMarca: porMarcaOrdenado,
    topModelos
  };
});

// Detect dark mode from root for SVG ring color
const isDark = ref(false);
onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    isDark.value = document.documentElement.classList.contains('dark') || media.matches;
  };
  media.addEventListener('change', handler);
});
</script>
