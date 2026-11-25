import { useContext, useEffect, useMemo } from 'react'
import api from './api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import { UserDataContext } from '@/contexts/UserDataContext'
import { AxiosError } from 'axios'

const ApiInterceptor = ({ children }) => {
  const { performLogout } = useContext(UserDataContext)
  const parseErrors = (error: AxiosError) => {
    try {
      if (!error.response) return 'Unable to connect to server'

      const responseData = error.response.data['errors']
      let formattedErrors = Object.entries(responseData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')

      return formattedErrors
    } catch {
      return 'Something went wrong'
    }
  }
  useMemo(() => {
    api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('token')
      if (token && !config.params?.emptyAuthorizationHeader) {
        config.headers.Authorization = 'Bearer ' + token
      }
      return config
    })

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await performLogout()
        } else {
          Alert.alert(parseErrors(error))
        }

        return Promise.reject(error)
      }
    )
  }, [])

  return <>{children}</>
}

export default ApiInterceptor
