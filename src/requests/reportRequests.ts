import api from '@/api/api'

export const fetchHoursYearToDate = (id: number) =>
  api.post('/report/hoursYearToDate', {
    user_id: id,
  })

export const fetchHoursByDateRange = (params: {
  start_date: string | Date
  end_date: string | Date
  employer_id?: number
  employee_id?: number
}) => api.post('/report/hoursByDateRange', { report: { ...params } })

export const fetchHoursForDateRange = (params: {
  start_date: string | Date
  end_date: string | Date
  is_range: boolean
  user_id?: number
}) => api.post('/report/hoursForDateRange', { report: { ...params } })

export const fetchEmployees = () => api.get('/employment_link')
