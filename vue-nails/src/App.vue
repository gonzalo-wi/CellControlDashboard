<script setup>
import { ref } from 'vue';
import NavBar from './components/NavBar.vue';
import ToastNotification from './components/ToastNotification.vue';

// Global toast instance
const toastRef = ref(null);

// Expose toast globally for use in views
if (typeof window !== 'undefined') {
  window.$toast = {
    success: (title, message) => toastRef.value?.add({ type: 'success', title, message }),
    error: (title, message) => toastRef.value?.add({ type: 'error', title, message }),
    info: (title, message) => toastRef.value?.add({ type: 'info', title, message }),
    warning: (title, message) => toastRef.value?.add({ type: 'warning', title, message }),
  };
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
    <NavBar />
    
    <!-- Page transitions -->
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- Global toast notifications -->
    <ToastNotification ref="toastRef" />
  </div>
</template>

<style>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Global smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.dark ::-webkit-scrollbar-track {
  background: #111827;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #374151;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
