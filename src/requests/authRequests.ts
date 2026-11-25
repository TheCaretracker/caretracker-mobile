import api from '../api/api'

export const login = async (
  user: {
    email: string
    password: string
    deviceToken: string
    timezone: string
  },
  tokenLogin = false
) =>
  api.post(
    '/login',
    { user },
    { params: { emptyAuthorizationHeader: !tokenLogin } }
  )

export const logout = async () => api.delete('/logout')
