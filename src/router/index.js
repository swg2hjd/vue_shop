import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
const Home = () => import('../views/Home')
const Welcome = () => import('../views/Welcome')
const Users = () => import('../views/user/Users')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path:'/roles',
        component:Users
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪个路径跳转而来
  // next:一个函数,表示放行: next()  next('/login):强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
