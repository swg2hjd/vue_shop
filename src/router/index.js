import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
const Home = () => import('../views/Home')
const Home2 = () => import('../views/Home2')
const MyNotes = () => import('../views/Notes/MyNotes')
const NotesExplain = () => import('../views/Notes/NotesExplain')
const NotesSetting = () => import('../views/Notes/NotesSetting')
const Welcome = () => import('../views/Welcome')
const Users = () => import('../views/user/Users')
const Rights = () => import('../views/power/Rights')
const Roles = () => import('../views/power/Roles')
const Cate = () => import('../views/goods/Cate')
const Params = () => import('../views/goods/Params')
const List = () => import('../views/goods/List')
const Order = () => import('../views/order/Order')
const Report = () => import('../views/report/Report')
const TestTable = () => import('../views/testTable/TestTable')
const TestTable2 = () => import('../views/testTable/TestTable2')
const NavMenu = () => import('../views/NavMenu/NavMenu')
const BaiDu = () => import('../views/iframe/BaiDu')


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/testtable',
    component: TestTable
  },
  {
    path: '/testtable2',
    component: TestTable2
  },
  {
    path: '/navmenu',
    component: NavMenu
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/index',
    component: Home2,
    children: [
      {
        path: '/MyNotes',
        component: MyNotes
      },
      {
        path: '/NotesExplain',
        component: NotesExplain
      },
      {
        path: '/NotesSetting',
        component: NotesSetting
      }
    ]
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
        name: 'Users',
        component: Users
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'Cate',
        component: Cate
      },
      {
        path: '/params',
        name: 'Params',
        component: Params
      },
      {
        path: '/goods',
        name: 'List',
        component: List
      },
      {
        path: '/orders',
        name: 'Order',
        component: Order
      },
      {
        path: '/reports',
        name: 'Report',
        component: Report
      },
      {
        path: '/baidu',
        name: 'BaiDu',
        component: BaiDu
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// ????????????????????????
router.beforeEach((to, from, next) => {
  // to:?????????????????????
  // from:???????????????????????????
  // next:????????????,????????????: next()  next('/login):????????????
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
