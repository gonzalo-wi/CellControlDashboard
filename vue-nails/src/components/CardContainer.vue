<template>
  <div class="group relative rounded-xl bg-white shadow-card hover:shadow-elevate-lg transition-all duration-300 overflow-hidden dark:bg-gray-900 animate-scale-in border border-gray-100 dark:border-gray-800">
    <!-- Decorative gradient border on hover -->
    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 via-purple-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
    
    <!-- Header con gradiente mejorado -->
    <div class="relative px-6 py-4 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 dark:from-brand-700 dark:via-brand-800 dark:to-gray-900 overflow-hidden">
      <!-- Decorative shapes -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div class="flex items-center justify-between relative z-10">
        <div class="flex-1">
          <h3 class="text-base font-semibold text-white transition-all duration-200 group-hover:translate-x-1">{{ title }}</h3>
          <p v-if="subtitle" class="text-xs text-brand-100 mt-1 transition-all duration-200 group-hover:text-brand-50">{{ subtitle }}</p>
        </div>
        <div class="transition-transform duration-200 group-hover:scale-105">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
    
    <!-- Content area con padding mejorado -->
    <div class="p-6 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <slot></slot>
    </div>
  </div>
 </template>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>
