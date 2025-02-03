import axios from 'axios'

// ** Config
import authConfig from './auth'

const instance = axios.create({
  baseURL: process.env.API_URL
})

// Add a request interceptor
instance.interceptors.request.use(
  async config => {
    const accessToken = localStorage.getItem('accessToken')
    config.headers = config.headers || {} // Initialize headers to an empty object if it's undefined
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalConfig = error.config
    // If the request failed due to an expired token, refresh the token and retry the original request
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true
      const refreshToken = window.localStorage.getItem('refreshToken')!
      if (refreshToken) {
        try {
          const response = await instance.post(`/auth/token/refresh/`, {
            refresh: refreshToken
          })
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.access)
          window.localStorage.setItem('refreshToken', response.data.refresh)

          // Update the Authorization header with the new token
          instance.defaults.headers.common.Authorization = `Bearer ${response.data.access}`

          // Retry the original request
          return instance(originalConfig)
        } catch (error) {
          // If refreshing the token failed, log the user out and redirect them to the login page
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.localStorage.removeItem('userData')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default instance
