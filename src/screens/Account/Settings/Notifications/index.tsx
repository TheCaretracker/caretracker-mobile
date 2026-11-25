import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { BackButtonHeader, CardWithToggle, CollapsibleCard } from '@/components'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Role, UserDataContext } from '@/contexts/UserDataContext'
import {
  EmployeeNotificationSettingData,
  EmployerNotificationSettingData,
} from './notificationData'
import { getNotificationsSettings, updateUser } from '@/requests/userRequests'
import { useFocusEffect } from '@react-navigation/native'

type NotitificationSettingsType = {
  caredForRoutineReminder: boolean
  dayOffReminder: boolean
  scheduleReminder: boolean
  payPeriodReminder: boolean
}

interface NotificationsSettings extends Partial<NotitificationSettingsType> {}

const NotificationSettingsScreen = ({ navigation }: any) => {
  const { isEmployee } = useContext(UserDataContext)

  const NotificationSettingData = isEmployee
    ? EmployeeNotificationSettingData
    : EmployerNotificationSettingData

  const [settings, setSettings] = useState<NotificationsSettings>({})
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>(false)

  const handleValueChange = async (key: string, value: boolean) => {
    const { data } = await updateUser({ [key]: value })

    if (data.success) {
      // setTriggerRefresh((previous) => !previous)
      setSettings((_settings) => {
        return {
          ..._settings,
          [key]: value,
        }
      })
    }
  }

  const fetchNotififcationsSettings = async () => {
    const { data } = await getNotificationsSettings()
    if (data.success) {
      setSettings(data.settings)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchNotififcationsSettings()
    }, [triggerRefresh])
  )

  return (
    <View style={styles.container}>
      <BackButtonHeader
        header="Notification Settings"
        navigation={navigation}
      />
      <View style={styles.wrapper}>
        {NotificationSettingData.map(({ header, text, key }, index) => (
          <CardWithToggle
            key={index}
            header={header}
            text={text}
            value={settings[key]}
            setValue={(value) => handleValueChange(key, value)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
})

export default NotificationSettingsScreen
