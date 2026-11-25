import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native'
import NotificationBellIcon from '@/assets/icons/notification-bell.svg'
import { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Avatar from '../Avatar/Avatar'
import { RedEllipse } from '@/assets/icons/icon'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { RouteProp, useRoute } from '@react-navigation/native'

type RootStackParamList = {
  Notification: { screenName?: string }
}

type AppHeaderRouteProp = RouteProp<RootStackParamList, 'Notification'>

interface Props {
  centerText?: boolean
  text: string
  navigation?: any
}

const isAndroid = Platform.OS === 'android'

const AppHeader = ({ centerText = true, text, navigation }: Props) => {
  const { hasUnread } = useContext(NotificationsContext)
  const isNotificationPage = text === 'Notification'
  const route = useRoute<AppHeaderRouteProp>()
  const screenName = route?.params?.screenName

  return (
    <View style={{ width: '100%' }}>
      <StatusBar backgroundColor="#4440D6" barStyle="light-content" />
      <View style={styles.container}>
        <View
          style={[
            styles.leftSide,
            centerText && styles.width13,
            centerText && styles.hidden,
          ]}
        >
          <View style={{ width: 42, height: 42 }}>
            <Avatar />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.leftHeader}>Welcome Back</Text>
            <Text style={styles.leftText}>{text}</Text>
          </View>
        </View>
        <Text style={[centerText ? styles.middleText : styles.displayNone]}>
          {text}
        </Text>
        <View style={styles.width13}>
          <TouchableOpacity
            onPress={() =>
              isNotificationPage
                ? // React Navigation 7: `pop: true` returns to the existing
                  // screen (v6 behaviour) instead of pushing a duplicate
                  navigation.navigate(screenName, undefined, { pop: true })
                : navigation.navigate('Notification', {
                    screenName: route.name,
                  })
            }
          >
            {hasUnread && <RedEllipse style={styles.ellipseIcon} />}
            <NotificationBellIcon
              width={20}
              height={20}
              style={styles.bellIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    paddingHorizontal: 24,
    backgroundColor: '#4440D6',
    height: 160,
    paddingTop: isAndroid ? 44 : 56,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  middleText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    maxWidth: '74%',
  },
  leftSide: {
    flexDirection: 'row',
    width: '66%',
    height: '50%',
    alignItems: 'center',
    marginTop: isAndroid ? -12 : 0,
  },
  leftText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
  },
  leftHeader: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
  },
  profileImage: {
    height: 40,
    aspectRatio: 1,
    marginRight: 10,
  },
  width13: {
    width: '13%',
  },
  displayNone: {
    display: 'none',
  },
  hidden: {
    opacity: 0,
  },
  bellIcon: {
    alignSelf: 'flex-end',
    marginTop: 7,
  },
  ellipseIcon: {
    position: 'absolute',
    right: 12,
    top: 8,
    zIndex: 9,
  },
})

export default AppHeader
