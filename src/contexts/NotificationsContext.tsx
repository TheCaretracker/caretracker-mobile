import CustomNotification from '../components/InAppNotification/CustomNotification'
import { navigate, getCurrentRouteName } from '@/helpers/RootNavigation'
import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AuthorizationStatus,
  getAPNSToken,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  requestPermission,
  setAPNSToken,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging'
import { messaging } from '@/firebase'
import {
  AppState,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { unreadNotifications } from '@/requests/notificationsRequests'
import { useFocusEffect } from '@react-navigation/native'
import { updateUser } from '@/requests/userRequests'
import { UserDataContext } from './UserDataContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const NotificationsContext = createContext({
  hasUnread: false,
  setHasUnread: (_value: boolean) => {},
  registerNotificationCallback: (_callback: (_data: any) => void) => {},
})

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [openNotifications, setOpenNotifications] = useState<any[]>([])
  const [hasUnread, setHasUnread] = useState<boolean>(false)
  const notificationCallbacksRef = useRef<((_data: any) => void)[]>([])

  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  const insets = useSafeAreaInsets()

  const { userData } = useContext(UserDataContext)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState
      setAppStateVisible(appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const updateDeviceToken = useCallback(
    async (deviceToken: string) => {
      if (!userData?.id) return
      await updateUser({ id: userData.id, deviceToken })
    },
    [userData]
  )

  const setNotificationCallback = (callback: (_data: any) => void) => {
    notificationCallbacksRef.current.push(callback)
  }

  useEffect(() => {
    async function requestUserPermission() {
      try {
        const authStatus = await requestPermission(messaging(), {
          alert: true,
          announcement: false,
          badge: true,
          carPlay: false,
          provisional: false,
          sound: true,
        })
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL

        if (enabled) {
          console.log('Authorization status:', authStatus)
          if (Platform.OS === 'ios') {
            const apnsToken = await getAPNSToken(messaging())
            if (apnsToken) {
              console.log('APNS Token:', apnsToken)
              setAPNSToken(messaging(), apnsToken)
            } else {
              console.error('No APNS token available')
            }
          } else {
            const result = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            )
            if (!result) {
              await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
              )
            }
          }
          const fcmToken = await getToken(messaging())
          await updateDeviceToken(fcmToken)
        } else {
          console.log('Push notifications not enabled')
        }
      } catch (error) {
        console.error('Error requesting push notification permissions:', error)
      }
    }

    requestUserPermission()

    onNotificationOpenedApp(messaging(), async (remoteMessage) => {
      navigateToNotification()
    })

    onMessage(messaging(), async (remoteMessage) => {
      const parseData = JSON.parse(remoteMessage.data?.payload || '{}')
      // console.log(
      //   'Foreground notification received:',
      //   remoteMessage.notification
      // )
      if (remoteMessage?.notification?.body) {
        // console.log(
        //   'Notification received:',
        //   parseData,
        //   remoteMessage?.notification
        // )
        setOpenNotifications((previous) => [...previous, parseData])
        setHasUnread(true)
      }
      notificationCallbacksRef.current.forEach((callback) =>
        callback?.(parseData.data)
      )
    })

    setBackgroundMessageHandler(messaging(), async (remoteMessage) => {
      const parseData = JSON.parse(remoteMessage.data?.payload || '{}')
      if (remoteMessage?.notification?.body) {
        setOpenNotifications((previous) => [...previous, parseData])
        setHasUnread(true)
      }
      notificationCallbacksRef.current.forEach((callback) =>
        callback?.(parseData.data)
      )
    })

    return () => {
      notificationCallbacksRef.current = []
    }
  }, [])

  const handleRemoveNotification = (index) => {
    setOpenNotifications((previous) => {
      const newNotifications = [...previous]
      newNotifications.splice(index, 1)
      return newNotifications
    })
  }

  const clearNotifications = () => {
    setOpenNotifications([])
  }

  const fetchUnread = async () => {
    const { data } = await unreadNotifications()

    if (data.success && data.unread) {
      setHasUnread(true)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (appStateVisible !== 'active') return
      fetchUnread()
    }, [appStateVisible])
  )

  function navigateToNotification() {
    navigate('Notification', {
      screenName: getCurrentRouteName(),
      key: new Date().getTime().toString(),
    })
    clearNotifications()
  }

  return (
    <NotificationsContext.Provider
      value={{
        hasUnread,
        setHasUnread,
        registerNotificationCallback: setNotificationCallback,
      }}
    >
      <View style={[styles.notificationContainer, { top: insets.top }]}>
        {openNotifications.map((value, index) => {
          return (
            <CustomNotification
              data={value}
              key={index}
              onPress={navigateToNotification}
              handleRemoveNotification={(e) => {
                e.stopPropagation()
                handleRemoveNotification(index)
              }}
            />
          )
        })}
      </View>

      {children}
    </NotificationsContext.Provider>
  )
}

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
})
