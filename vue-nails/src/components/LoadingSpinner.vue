<template>
  <div class="flex flex-col items-center justify-center py-8" role="status" aria-live="polite">
    <svg :class="spinnerClass" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" :class="colorClass" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p v-if="label" class="mt-3 text-sm text-gray-600">{{ label }}</p>
  </div>
  
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg
  color: { type: String, default: 'blue' } // 'blue' | 'indigo' | 'brand' | 'green' | 'red' | 'yellow' | 'purple'
});

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
};

const colorMap = {
  blue: 'text-blue-600',
  indigo: 'text-indigo-600',
  brand: 'text-brand-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
};

const spinnerClass = computed(() => {
  const sz = sizeMap[props.size] || sizeMap.md;
  const color = colorMap[props.color] || colorMap.blue;
  return `animate-spin ${sz} ${color}`;
});
const colorClass = computed(() => colorMap[props.color] || colorMap.blue);
</script>
