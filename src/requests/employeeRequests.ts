import api from '@/api/api'

export const searchEmployee = async (name: string = '') =>
  api.post(`/employee/search`, { employee: { name } })

export const showEmployee = (id) => api.get(`employee/${id}`)

export const inviteEmployee = (id) =>
  api.post(`employee/invite`, { employee: { id } })
