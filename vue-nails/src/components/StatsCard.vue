<template>
  <div class="group relative overflow-hidden rounded-xl bg-white shadow-card hover:shadow-elevate hover:-translate-y-1 transition-all duration-300 dark:bg-gray-900 animate-fade-in-up">
    <!-- Accent bar con animación de pulso sutil -->
    <div class="absolute inset-x-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5" :class="accentBarClass"></div>
    
    <!-- Background gradient decorativo que se anima al hover -->
    <div class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" 
         :class="`bg-gradient-to-br ${gradientClass}`"></div>
    
    <div class="p-6 relative z-10">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 transition-colors">{{ title }}</p>
          <p class="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100 tabular-nums transition-all duration-500" :key="value">
            {{ displayValue }}
          </p>
          <p v-if="subtitle" class="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">{{ subtitle }}</p>
        </div>
        
        <!-- Icon container con animación mejorada -->
        <div class="relative">
          <div class="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" 
               :class="iconBgClass"></div>
          <div class="relative p-3 rounded-full bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
               :class="iconContainerClass">
            <svg 
              class="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
              :class="iconColorClass"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="iconPath"
              />
            </svg>
          </div>
        </div>
      </div>

      <div v-if="trend" class="mt-4 flex items-center gap-2 animate-slide-in-left">
        <span 
          class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200"
          :class="trendBadgeClass"
        >
          <svg v-if="trendType === 'positive'" class="w-4 h-4 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <svg v-else-if="trendType === 'negative'" class="w-4 h-4 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {{ trend }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'chart' // chart, phone, users, check, alert
  },
  color: {
    type: String,
    default: 'blue' // blue, green, yellow, red, purple, indigo
  },
  trend: {
    type: String,
    default: ''
  },
  trendType: {
    type: String,
    default: 'neutral' // positive, negative, neutral
  }
});

const iconPaths = {
  chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  phone: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
};

const colorClasses = {
  blue: { icon: 'text-blue-600', bar: 'bg-blue-600' },
  green: { icon: 'text-green-600', bar: 'bg-green-600' },
  yellow: { icon: 'text-yellow-600', bar: 'bg-yellow-600' },
  red: { icon: 'text-red-600', bar: 'bg-red-600' },
  purple: { icon: 'text-purple-600', bar: 'bg-purple-600' },
  indigo: { icon: 'text-indigo-600', bar: 'bg-indigo-600' }
};

const iconPath = computed(() => iconPaths[props.icon] || iconPaths.chart);
const iconColorClass = computed(() => colorClasses[props.color]?.icon || colorClasses.blue.icon);
const accentBarClass = computed(() => colorClasses[props.color]?.bar || colorClasses.blue.bar);

const gradientClass = computed(() => {
  const gradients = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    yellow: 'from-yellow-400 to-yellow-600',
    red: 'from-red-400 to-red-600',
    purple: 'from-purple-400 to-purple-600',
    indigo: 'from-indigo-400 to-indigo-600'
  };
  return gradients[props.color] || gradients.blue;
});

const iconBgClass = computed(() => {
  const bgs = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };
  return bgs[props.color] || bgs.blue;
});

const iconContainerClass = computed(() => {
  const containers = {
    blue: 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
    green: 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40',
    yellow: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40',
    red: 'from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40',
    purple: 'from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40',
    indigo: 'from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40'
  };
  return containers[props.color] || containers.blue;
});

const trendBadgeClass = computed(() => {
  if (props.trendType === 'positive') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (props.trendType === 'negative') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
});

// Animated value display
const displayValue = computed(() => props.value);
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.4s ease-out 0.2s both;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}
</style>
