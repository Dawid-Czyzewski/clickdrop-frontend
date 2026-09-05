import './axiosTypes'
import axios from 'axios'
import { attachAuthHeader, createUnauthorizedHandler } from './axiosInterceptors'
import { getApiBaseUrl } from './env'

export const API_BASE_URL = getApiBaseUrl()

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(attachAuthHeader)
apiClient.interceptors.response.use(
  (response) => response,
  createUnauthorizedHandler(apiClient),
)
