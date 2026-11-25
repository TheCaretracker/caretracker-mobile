import api from '@/api/api'

export const listSchedule = (params) =>
  api.get('/schedule', { params: { start_date: params.startDate } })

export const showSchedule = (id) => api.get(`/schedule/${id}`)

export const createSchedule = (params) =>
  api.post('/schedule', { schedule: { ...params } })

export const updateSchedule = (id, params) =>
  api.put(`/schedule/${id}`, { schedule: { ...params } })

export const acceptSchedule = (id: number, params: { accept: boolean }) =>
  api.post(`/schedule/${id}/accept`, { schedule: { ...params } })

export const acceptDeclineScheduleChangeRequest = (
  id: number,
  params: { accept: boolean }
) =>
  api.post(`/recurring_event_changes_requests/${id}/accept`, {
    schedule: { ...params },
  })

export const getLinkedUsersFromSchedule = (id: number) =>
  api.get(`/schedule/${id}/linked_users`)
