<template>
  <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-200/50 shadow-lg dark:bg-gray-900/90 dark:border-gray-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Brand with enhanced design -->
        <div class="flex items-center gap-4 group cursor-pointer">
          <div class="relative">
            <!-- Glow effect background -->
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 scale-90 group-hover:scale-110"></div>
            <!-- Logo container with border -->
            <div class="relative z-10 p-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm group-hover:shadow-md transition-all duration-300">
              <img :src="logoUrl" alt="Logo CellControl" class="h-8 w-auto transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div class="hidden sm:block">
            <div class="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent transition-all duration-300">
              Control de Gestión
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Sistema de Estadísticas
            </div>
          </div>
        </div>

        <!-- Desktop navigation with improved design -->
        <div class="hidden md:flex items-center gap-2">
          <router-link
            to="/celulares"
            class="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group/link"
            :class="navLinkClass('/celulares')"
          >
            <!-- Active indicator -->
            <div v-if="isActive('/celulares')" class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:to-indigo-400/20 rounded-xl"></div>
            <div class="relative flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover/link:bg-blue-200 dark:group-hover/link:bg-blue-800/70 transition-colors">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Celulares</span>
            </div>
          </router-link>

          <router-link
            to="/usuarios"
            class="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group/link"
            :class="navLinkClass('/usuarios')"
          >
            <div v-if="isActive('/usuarios')" class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-xl"></div>
            <div class="relative flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 group-hover/link:bg-emerald-200 dark:group-hover/link:bg-emerald-800/70 transition-colors">
                <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span>Usuarios</span>
            </div>
          </router-link>

          <router-link
            to="/regiones"
            class="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group/link"
            :class="navLinkClass('/regiones')"
          >
            <div v-if="isActive('/regiones')" class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/20 dark:to-pink-400/20 rounded-xl"></div>
            <div class="relative flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 group-hover/link:bg-purple-200 dark:group-hover/link:bg-purple-800/70 transition-colors">
                <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <span>Regiones</span>
            </div>
          </router-link>

          <router-link
            to="/reparaciones"
            class="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group/link"
            :class="navLinkClass('/reparaciones')"
          >
            <div v-if="isActive('/reparaciones')" class="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-400/20 dark:to-amber-400/20 rounded-xl"></div>
            <div class="relative flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/50 group-hover/link:bg-orange-200 dark:group-hover/link:bg-orange-800/70 transition-colors">
                <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <span>Reparaciones</span>
            </div>
          </router-link>

          <!-- Divider -->
          <div class="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-700 mx-2"></div>

          <!-- Dark mode toggle with enhanced design -->
          <button
            @click="toggleDark()"
            class="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group/dark border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
            :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            <!-- Animated background -->
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-orange-400/0 dark:from-blue-400/0 dark:to-purple-400/0 group-hover/dark:from-yellow-400/20 dark:group-hover/dark:from-blue-400/20 group-hover/dark:to-orange-400/20 dark:group-hover/dark:to-purple-400/20 rounded-xl transition-all duration-300"></div>
            <div class="relative">
              <svg v-if="!isDark" class="h-5 w-5 text-gray-700 group-hover/dark:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-300 group-hover/dark:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Mobile menu button with animation -->
        <button 
          @click="mobileOpen = !mobileOpen"
          class="md:hidden relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700"
        >
          <svg class="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu with improved design -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileOpen" class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
        <div class="px-4 pt-4 pb-6 space-y-2">
          <router-link
            to="/celulares"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            :class="mobileLinkClass('/celulares')"
            @click="mobileOpen = false"
          >
            <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span>Celulares</span>
          </router-link>

          <router-link
            to="/usuarios"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            :class="mobileLinkClass('/usuarios')"
            @click="mobileOpen = false"
          >
            <div class="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span>Usuarios</span>
          </router-link>

          <router-link
            to="/regiones"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            :class="mobileLinkClass('/regiones')"
            @click="mobileOpen = false"
          >
            <div class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span>Regiones</span>
          </router-link>

          <router-link
            to="/reparaciones"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            :class="mobileLinkClass('/reparaciones')"
            @click="mobileOpen = false"
          >
            <div class="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <span>Reparaciones</span>
          </router-link>

          <!-- Dark mode toggle for mobile -->
          <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              @click="toggleDark()"
              class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <span class="text-base font-semibold text-gray-700 dark:text-gray-300">
                {{ isDark ? 'Modo Claro' : 'Modo Oscuro' }}
              </span>
              <div class="p-2 rounded-lg bg-white dark:bg-gray-900">
                <svg v-if="!isDark" class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import logoUrl from '../assets/LogoCellControl.png';

const route = useRoute();
const mobileOpen = ref(false);

const isActive = (path) => computed(() => route.path === path).value;

// Enhanced link classes for desktop
const navLinkClass = (path) => {
  const active = isActive(path);
  if (isDark.value) {
    return active
      ? 'text-gray-100 shadow-md'
      : 'text-gray-400 hover:text-gray-200 hover:shadow-sm';
  }
  return active
    ? 'text-gray-900 shadow-md'
    : 'text-gray-600 hover:text-gray-900 hover:shadow-sm';
};

// Enhanced link classes for mobile
const mobileLinkClass = (path) => {
  const active = isActive(path);
  if (isDark.value) {
    return active
      ? 'bg-gray-800 text-gray-100 shadow-lg'
      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200';
  }
  return active
    ? 'bg-gray-100 text-gray-900 shadow-lg'
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
};

// Dark mode support (Tailwind 'class' strategy)
const isDark = ref(false);
const applyDark = (val) => {
  const root = document.documentElement;
  if (val) root.classList.add('dark');
  else root.classList.remove('dark');
};
const toggleDark = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('prefers_dark', isDark.value ? '1' : '0');
  applyDark(isDark.value);
};
onMounted(() => {
  const stored = localStorage.getItem('prefers_dark');
  if (stored === '1') isDark.value = true;
  // Fallback to OS preference first time
  if (stored === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true;
  }
  applyDark(isDark.value);
});
</script>
