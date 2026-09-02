import './axiosTypes'
import axios from 'axios'
import { attachAuthHeader, createUnauthorizedHandler } from './axiosInterceptors'

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

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
