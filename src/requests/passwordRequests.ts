import api from '../api/api'

export const forgotPassword = (params: any) =>
  api.post('/password', { ...params })

export const resetPassword = (params: any) =>
  api.put('/password', { ...params })

export const checkToken = (params: any) =>
  api.post('/password/check-token', { ...params })
