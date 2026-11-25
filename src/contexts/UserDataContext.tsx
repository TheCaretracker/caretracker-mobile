import { login, logout } from '@/requests/authRequests'
import { me, updateUser } from '@/requests/userRequests'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useCallback, useEffect, useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import {
  AuthorizationStatus,
  getAPNSToken,
  getToken,
  hasPermission,
  onTokenRefresh,
  setAPNSToken,
} from '@react-native-firebase/messaging'
import { messaging } from '@/firebase'
import * as Localization from 'expo-localization'
import { User } from '../types/user'

function getCurrentTimezone() {
  try {
    const calendars = Localization.getCalendars()
    if (calendars.length > 0 && calendars[0].timeZone) {
      return calendars[0].timeZone
    }
    // Fallback for web or unsupported devices
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.warn('Could not detect timezone:', error)
    return 'UTC' // Default fallback
  }
}

// Enum declaration for user role
export enum Role {
  Employer = 'employer',
  Employee = 'employee',
}

interface UserDataContextType {
  userData: User | null
  refetchUserData: () => Promise<void>
  performLogin: (
    values: { email: string; password: string },
    tokenLogin?: boolean
  ) => Promise<void>
  performLogout: () => Promise<void>
  deleteUserData: () => Promise<void>
  getRole: () => Role | null
  isEmployee: boolean
  isEmployer: boolean
  loading: boolean
}

export const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  refetchUserData: async () => {},
  performLogin: async (
    values: { email: string; password: string },
    tokenLogin?: boolean
  ) => {},
  performLogout: async () => {},
  deleteUserData: async () => {},
  getRole: () => null as Role | null,
  isEmployee: false,
  isEmployer: false,
  loading: true,
})

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [deviceToken, setDeviceToken] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await AsyncStorage.getItem('caretracker@user')
      if (user) {
        setUserData(JSON.parse(user))
      }
      setLoading(false)
    }

    fetchUserData()
  }, [])

  const refetchUserData = async () => {
    const { data } = await me()
    if (data.success) {
      setUserData(data.user)
      await AsyncStorage.setItem('caretracker@user', JSON.stringify(data.user))
    }
  }

  useEffect(() => {
    const requestPermissionAndFetchToken = async () => {
      try {
        // Register for remote messages FIRST (required on iOS)
        // await messaging().registerDeviceForRemoteMessages()

        const authStatus = await hasPermission(messaging())
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL

        if (enabled) {
          console.log('Push notifications enabled')

          if (Platform.OS === 'ios') {
            const apnsToken = await getAPNSToken(messaging())
            if (apnsToken) {
              setAPNSToken(messaging(), apnsToken)
            } else {
              console.error('No APNS token available')
            }
          } else {
            const result = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            )
            if (!result) {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
              )
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Push notifications enabled on Android')
              } else {
                console.warn('Push notifications not enabled on Android')
              }
            }
          }

          const fcmToken = await getToken(messaging())
          console.log('FCM Token:', fcmToken)
          setDeviceToken(fcmToken)
        } else {
          console.warn('Push notifications not enabled')
        }
      } catch (error) {
        console.error('Error requesting push notification permissions:', error)
      }
    }

    requestPermissionAndFetchToken()

    return onTokenRefresh(messaging(), (token) => {
      setDeviceToken(token)
    })
  }, [])

  const updateDeviceToken = useCallback(async () => {
    await updateUser({ id: userData.id, deviceToken })
  }, [userData, deviceToken])

  useEffect(() => {
    if (userData) updateDeviceToken()
  }, [userData, updateDeviceToken])

  const performLogin = async (
    values: { email: string; password: string },
    tokenLogin = false
  ) => {
    const timezone = getCurrentTimezone()
    try {
      const response = await login(
        { ...values, deviceToken, timezone },
        tokenLogin
      )
      if (response.status == 201) {
        const authHeader = response.headers['authorization']
        const token = authHeader ? authHeader.split(' ')[1] : null
        await AsyncStorage.setItem('token', token)
        await AsyncStorage.setItem(
          'caretracker@user',
          JSON.stringify(response.data)
        )

        setUserData(response.data)
      }
    } catch (error) {
      throw new Error(error?.response?.data?.error)
    }
  }

  const performLogout = async () => {
    await logout()
    await AsyncStorage.multiRemove(['token', 'caretracker@user'])
    setUserData(null)
  }

  const deleteUserData = async () => {
    await AsyncStorage.multiRemove(['token', 'caretracker@user'])
    setUserData(null)
  }

  const getRole = () => {
    return userData
      ? {
          Caregiver: Role.Employee,
          Guardian: Role.Employer,
        }[userData.type]
      : null
  }

  const isEmployee = userData?.type === 'Caregiver'
  const isEmployer = userData?.type === 'Guardian'

  return (
    <UserDataContext.Provider
      value={{
        userData,
        refetchUserData,
        performLogin,
        performLogout,
        deleteUserData,
        getRole,
        isEmployee,
        isEmployer,
        loading,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}
