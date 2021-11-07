import axios from 'axios'
const instance = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
  timeout: 5 * 1000
})

instance.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, err => Promise.reject(err)
)

instance.interceptors.response.use(res => res, err => err)


function request(config) {
  return instance(config)
}

export  {request}