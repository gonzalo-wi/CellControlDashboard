<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed',
      variantClasses,
      sizeClasses,
      disabled || loading ? 'opacity-60' : 'hover:scale-[1.02] active:scale-[0.98]'
    ]"
    @click="handleClick"
  >
    <!-- Ripple effect -->
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
      :style="{
        left: ripple.x + 'px',
        top: ripple.y + 'px',
        width: ripple.size + 'px',
        height: ripple.size + 'px',
      }"
    ></span>

    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon slot -->
    <span v-if="$slots.icon && !loading" class="flex-shrink-0">
      <slot name="icon"></slot>
    </span>

    <!-- Content -->
    <span class="relative z-10">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, success, danger, outline
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const ripples = ref([]);
let rippleId = 0;

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md hover:shadow-lg',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-md hover:shadow-lg',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  };
  return variants[props.variant] || variants.primary;
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  return sizes[props.size] || sizes.md;
});

const handleClick = (event) => {
  if (props.disabled || props.loading) return;

  // Create ripple effect
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const id = rippleId++;
  ripples.value.push({ id, x, y, size });

  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id);
  }, 600);

  emit('click', event);
};
</script>

<style scoped>
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}
</style>
