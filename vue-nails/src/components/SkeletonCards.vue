<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div v-for="i in count" :key="i" class="animate-pulse">
      <div class="rounded-xl bg-white shadow-card overflow-hidden dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <!-- Accent bar skeleton -->
        <div class="h-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
        
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1 space-y-3">
              <!-- Title skeleton -->
              <div class="h-3 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
              <!-- Value skeleton -->
              <div class="h-8 bg-gray-300 rounded dark:bg-gray-600 w-20"></div>
              <!-- Subtitle skeleton -->
              <div class="h-3 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
            </div>
            
            <!-- Icon skeleton -->
            <div class="w-14 h-14 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 4
  }
});
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
