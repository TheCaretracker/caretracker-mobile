import api from '@/api/api'

export const listWorkEvents = (nextOccurencesLimit: number = 4) =>
  api.get(`/event?next_occurrences_limit=${nextOccurencesLimit}`)
export const clockIn = (event) => api.post('/event/clock_in', { event })
export const clockOut = (id) => api.patch(`event/${id}/clock_out`)

export const listWeekHours = () => api.get('/week_hour')
export const showEvent = (id) => api.get(`/event/${id}`)

export const clockInOutRequest = (timeRecord) =>
  api.post('events_changes_requests', { timeRecord })
export const acceptDeclineTimeRecordRequest = (id, params) =>
  api.post(`/events_changes_requests/${id}/accept`, {
    timeRecord: { ...params },
  })

export const createEvent = (event) => api.post('event', { event })
export const updateEvent = (id, event) => api.patch(`event/${id}`, { event })

export const deleteEvent = (id) => api.delete(`event/${id}`)
