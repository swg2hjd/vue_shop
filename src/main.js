import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
Vue.prototype.$http = axios
Vue.use(ElementUI)
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
const instance1 = axios.create({
  baseURL: 'http://localhost:3000/'
})
Vue.prototype.$http2 = instance1
// 请求拦截
axios.interceptors.request.use(config => {
  // console.log(config)
  // 为请求头对象添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
// 全局注册组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
