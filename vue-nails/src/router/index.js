import { createRouter, createWebHistory } from 'vue-router';
import DashboardReparaciones from '../views/DashboardReparaciones.vue';
import Usuarios from '../views/Usuarios.vue';
import Celulares from '../views/Celulares.vue';
import Regiones from '../views/Regiones.vue';

const routes = [
  {
    path: '/',
    redirect: '/celulares'
  },
  {
    path: '/reparaciones',
    name: 'DashboardReparaciones',
    component: DashboardReparaciones
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuarios
  },
  {
    path: '/celulares',
    name: 'Celulares',
    component: Celulares
  },
  {
    path: '/regiones',
    name: 'Regiones',
    component: Regiones
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
