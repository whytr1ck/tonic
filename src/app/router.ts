import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@modules/home/pages/HomePage.vue'),
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('@modules/portfolio/pages/PortfolioPage.vue'),
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('@modules/alerts/pages/AlertsPage.vue'),
    },
  ],
});

export default router;
