import api from '@/api/api'

export const listInvites = async () => api.get('/invite')
export const showInvite = async (code: string) => api.get(`/invite/${code}`)
export const showInviteById = async (id: string) =>
  api.get(`/invite/${id}`, { params: { 'is-id': true } })

export const createInvite = async (params: any) =>
  api.post('/invite', { invite: { ...params } })

export const deleteInvite = async (id: string) => api.delete(`/invite/${id}`)
