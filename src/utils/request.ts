import axios from 'axios'

const service = axios.create({
  baseURL: 'https://mock.apifox.cn/m1/2174305-0-default',
  timeout: 6000
})

// 请求拦截
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if(token) {
    config.headers.Authorization = token
  }
  return config
})

// 响应拦截
service.interceptors.response.use(
  res => res.data,
  err => {
    console.log('请求错误', err)
    return Promise.reject(err)
  }
)

export default service