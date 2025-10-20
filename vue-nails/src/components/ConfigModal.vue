<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="cerrar"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Configuración de API</h3>
        <button 
          @click="cerrar"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="guardarConfig">
        <!-- IP del Servidor -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            IP del Servidor
          </label>
          <input 
            v-model="config.ip"
            type="text"
            placeholder="192.168.0.55"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- Puerto -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Puerto
          </label>
          <select 
            v-model="config.puerto"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="8080">8080</option>
            <option value="8082">8082</option>
          </select>
        </div>

        <!-- Usuario -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <input 
            v-model="config.username"
            type="text"
            placeholder="admin"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- Contraseña -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input 
            v-model="config.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- URL Completa (Preview) -->
        <div class="mb-4 p-3 bg-gray-50 rounded-md">
          <p class="text-xs text-gray-600 mb-1">URL de la API:</p>
          <p class="text-sm font-mono text-gray-900">
            http://{{ config.ip }}:{{ config.puerto }}/api/estadisticas
          </p>
        </div>

        <!-- Botones -->
        <div class="flex gap-3">
          <button 
            type="button"
            @click="cerrar"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar y Conectar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentConfig: {
    type: Object,
    default: () => ({
      ip: '192.168.0.55',
      puerto: '8082',
      username: 'admin',
      password: 'admin123'
    })
  }
});

const emit = defineEmits(['close', 'save']);

const config = ref({ ...props.currentConfig });

// Actualizar config cuando cambia currentConfig
watch(() => props.currentConfig, (newConfig) => {
  config.value = { ...newConfig };
}, { deep: true });

const cerrar = () => {
  emit('close');
};

const guardarConfig = () => {
  emit('save', { ...config.value });
  cerrar();
};
</script>
