import api from '@/api/api'
import { CaredForData } from '@/types/caredFor'
import { serializeQuery } from '@/utils/params'

export const listCaredFor = async (filters = {}) =>
  api.get('/caree', {
    params: filters,
    paramsSerializer: (params) => serializeQuery(params),
  })

export const showCaredFor = async (id) => api.get(`/caree/${id}`)

export const createCaredFor = async (values: CaredForData) =>
  api.post('/caree', { caree: values })

export const updateCaredFor = async (id: string, values: CaredForData) => {
  return api.put(`caree/${id}`, { caree: values })
}

export const deleteCaredFor = async (id: string) => api.delete(`caree/${id}`)
