import api from '@/api/api'
import { serializeQuery } from '@/utils/params'

export const listTimesheet = (filters) =>
  api.get('/timesheet', {
    params: filters,
    paramsSerializer: (params) => serializeQuery(params),
  })

export const getTimesheetOptions = () => api.get('/timesheet/options')
