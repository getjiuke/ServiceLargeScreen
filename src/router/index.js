import { createRouter, createWebHashHistory } from 'vue-router'
import { ElLoading } from 'element-plus'
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/ExternalLoading',
	name: 'ExternalLoading',
	component: ()=>import('../views/External-Loading/index.vue') 
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from,next) => {
  const loading = ElLoading.service({
	lock: true,
	text: 'Loading...',
	background: 'rgba(0,0,0,0)',
  })
  
  if(to.fullPath == '/'){
    sessionStorage.clear();
    localStorage.clear();
  }

  loading.close()
  return next();
})

export default router
