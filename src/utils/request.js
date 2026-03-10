import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api',//基础路径 前缀
  timeout: 5000,//超时时间
})
//请求拦截器
service.interceptors.request.use(
  config => {
    //在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
//响应拦截器
service.interceptors.response.use(
  (response) => {
    //对响应数据做点什么
    const { data, config } = response
    //如果响应状态码为200，说明请求成功
    if (data.code === '200') {
      return data.data
    } else {
      if (data.code === '-1') {
        if (config.url?.includes('/login')) {
          ElMessage.error('用户名或密码错误')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/auth/login'
        }
      }
      else {
        ElMessage.error(data.msg || '请求失败')
        return Promise.reject('请求失败')
      }
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service