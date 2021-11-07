import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入页面加载的进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Print from 'vue-print-nb'
Vue.use(Print)
Vue.prototype.$http = axios
Vue.use(ElementUI)
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
const instance1 = axios.create({
  baseURL: 'http://localhost:3000/'
})
instance1.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})
instance1.interceptors.response.use(config => {
  NProgress.done();
  return config;
})
Vue.prototype.$http2 = instance1
// 请求拦截
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象添加Token验证的Authorization字段
  // 展示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done();
  return config;
})
Vue.config.productionTip = false
Vue.filter('dateFormat', (originVal) => {
  const date = new Date(originVal)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')
  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 全局注册组件
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
