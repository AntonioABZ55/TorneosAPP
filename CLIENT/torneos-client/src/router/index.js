import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import TorneosOrganizador from '../components/TorneosOrganizador.vue';
import TorneosParticipante from '../components/TorneosParticipante.vue';

const routes = [
  {
    path: '/',
    redirect: '/login', // Redirige automáticamente a /login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/registro',
    name: 'Register',
    component: Register,
  },
  {
    path: '/torneos/organizador',
    name: 'TorneosOrganizador',
    component: TorneosOrganizador,
    meta: { requiresAuth: true },
  },
  {
    path: '/torneos/participante',
    name: 'TorneosParticipante',
    component: TorneosParticipante,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protege las rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/torneos/organizador' && userRole !== 'organizador') {
    next('/torneos/participante');
  } else if (to.path === '/torneos/participante' && userRole !== 'participante') {
    next('/torneos/organizador');
  } else {
    next();
  }
});

export default router;

