import Notificationpage from '@/screens/Notification/NotificationPage'
import React, { FC } from 'react'
import {
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Dimensions,
} from 'react-native'

interface CustomNotificationProps {
  data: any
  onPress: (event: GestureResponderEvent) => void
  handleRemoveNotification: (event: GestureResponderEvent) => void
}

const CustomNotification: FC<CustomNotificationProps> = ({
  data,
  onPress,
  handleRemoveNotification,
}) => {
  const screenWidth = Dimensions.get('window').width

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'relative',
        zIndex: 1000,
        width: screenWidth / 1.08,
      }}
    >
      <View
        style={{
          padding: 8,
          backgroundColor: '#FFFFFF',
          marginHorizontal: 16,
          marginBottom: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#4440D6',
          shadowColor: '#1E2122',
          shadowOffset: {
            width: 4,
            height: 4,
          },
          shadowOpacity: 0.42,
          shadowRadius: 10,
          width: '100%',
        }}
      >
        <Notificationpage
          notification={data}
          inapp={true}
          handleRemoveNotification={handleRemoveNotification}
        />
      </View>
    </TouchableOpacity>
  )
}

export default CustomNotification
