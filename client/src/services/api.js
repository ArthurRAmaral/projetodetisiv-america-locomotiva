import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  baseURL: '/api/v1',
})

api.interceptors.request.use(async config => {
  const token = getToken()
  if (token) {
    /* eslint no-param-reassign: 0 */
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
