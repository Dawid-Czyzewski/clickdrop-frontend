import type { InternalAxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean
  }
}

export type { InternalAxiosRequestConfig }
