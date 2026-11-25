import api from '../api/api'

export const me = async () => api.get('/me')

export const updateUser = async (params) =>
  api.put('/signup', { user: { ...params } })

export const createUser = async (params) =>
  api.post('/signup', { user: { ...params } })

export const deleteUser = async () => api.delete('/users/destroy')

export const getNotificationsSettings = async () => api.get('/users/settings')

export const userExists = async (email: string) =>
  api.post('/users/exists', { user: { email } })
