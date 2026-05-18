import axios from 'axios'

export const isAxiosNotFound = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404

export const isApiNotReady = (error: unknown): boolean => isAxiosNotFound(error)
