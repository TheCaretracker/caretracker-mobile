import api from '@/api/api'

export const listEmploymentUsers = async (params = {}) =>
  api.get('/employment_link', { params })

export const listEmploymentRecurringEvents = async (id) =>
  api.get(`/employment_link/${id}/recurring_events`)

export const createEmploymentLink = async (params: any) =>
  api.post('employment_link', { employmentLink: { ...params } })

export const updateEmploymentLink = async (id: number, params: any) =>
  api.put(`employment_link/${id}`, { employmentLink: { ...params } })

export const acceptEmploymentInvite = async (id: number, accept: boolean) =>
  api.put(`employment_link/${id}`, {
    employmentLink: { id, status: accept ? 'accepted' : 'denied' },
  })

export const deleteEmploymentLink = async (id) =>
  api.delete(`/employment_link/${id}`)

export const acceptInvite = async (code) =>
  api.post(`employment_link/${code}/invite`)
