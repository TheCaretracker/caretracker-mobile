import { StyleSheet, View, FlatList } from 'react-native'
import { AppHeader } from '@/components'

import Notificationpage from './NotificationPage'
import { useCallback, useContext, useEffect, useState } from 'react'
import ScheduleAcceptanceModal from '@/components/ScheduleCard/ScheduleAcceptanceModal'
import { useFocusEffect } from '@react-navigation/native'
import {
  deleteNotification,
  listNotifications,
} from '@/requests/notificationsRequests'
import { NotificationTypeEnum } from './NotificationTypeEnum'
import EmploymentInviteModal from '@/components/EmploymentInviteModal/EmploymentInviteModal'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import TimeRecordActionModal from '../Dashboard/TimeSheet/TimeRecordActionModal'
import branch from 'react-native-branch'

const Notification = ({ navigation, route }: any) => {
  const key = route?.params?.key
  const { setHasUnread } = useContext(NotificationsContext)
  const [notifications, setNotifications] = useState<any[]>()
  const [size, setSize] = useState(10)
  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean
    id?: number
    type?: 'accept' | 'decline'
    notification?: any
  }>({ isOpen: false })
  const [timeRecordModal, setTimeRecordModal] = useState<{
    isOpen: boolean
    id?: number
    type?: 'accept' | 'decline'
    notification?: any
  }>({ isOpen: false })

  const [inviteModal, setInviteModal] = useState<{
    isOpen: boolean
    id?: number
    type?: 'accept' | 'decline'
    notification?: any
  }>({ isOpen: false })

  const fetchNotifications = async () => {
    const { data } = await listNotifications()
    if (data.success) {
      const filteredNotifications = data.notifications.filter((n) =>
        Object.values(NotificationTypeEnum).includes(n.type)
      )
      setNotifications(filteredNotifications)
      setSize((prev) =>
        prev + 5 > filteredNotifications.length
          ? filteredNotifications.length
          : prev + 5
      )
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchNotifications()
      setHasUnread(false)
    }, [key])
  )

  useEffect(() => {
    branch.subscribe({
      onOpenComplete: () => {
        fetchNotifications()
      },
    })
  }, [])

  const handleDelete = async (notification) => {
    if (
      [
        NotificationTypeEnum.ScheduleRequest,
        NotificationTypeEnum.ScheduleChangeRequest,
      ].includes(notification.type)
    ) {
      setScheduleModal({
        isOpen: true,
        id: notification.recurringEventId,
        notification: notification,
      })
    } else if (notification.type === NotificationTypeEnum.InviteRequest) {
      setInviteModal({
        isOpen: true,
        id: notification.employmentLinkId,
        notification: notification,
      })
    } else {
      const noti_id = notification.id
      if (noti_id) {
        setNotifications((prev) => [
          ...prev.filter((noti) => noti.id !== noti_id),
        ])
        await deleteNotification(noti_id)
      }
      await fetchNotifications()
    }
  }

  const renderSkeleton = () => {
    return (
      <View style={styles.skeletonWrapper}>
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <AppHeader text="Notification" navigation={navigation} />
      {notifications ? (
        <FlatList
          data={notifications.slice(0, size)}
          contentContainerStyle={styles.wrapper}
          style={styles.content}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={() => {
            setSize((prev) =>
              prev + 5 > notifications.length ? notifications.length : prev + 5
            )
          }}
          onEndReachedThreshold={0.5}
          renderItem={({ item: notification, index }) => (
            <Notificationpage
              hasMarginBottom={true}
              notification={notification}
              notificationIndex={index}
              handleDelete={() => handleDelete(notification)}
              setScheduleModal={(attrs) =>
                setScheduleModal({ notification: notification, ...attrs })
              }
              setInviteModal={(attrs) =>
                setInviteModal({ notification: notification, ...attrs })
              }
              setTimeRecordModal={(attrs) =>
                setTimeRecordModal({ notification: notification, ...attrs })
              }
            />
          )}
        />
      ) : (
        renderSkeleton()
      )}

      <ScheduleAcceptanceModal
        id={scheduleModal.id}
        type={scheduleModal.type}
        isVisible={scheduleModal.isOpen}
        notification={scheduleModal.notification}
        setIsModalVisible={(isOpen) => setScheduleModal({ isOpen })}
        onAcceptance={() => fetchNotifications()}
      />
      <EmploymentInviteModal
        id={inviteModal.id}
        type={inviteModal.type}
        isVisible={inviteModal.isOpen}
        setIsModalVisible={(isOpen) => setInviteModal({ isOpen })}
        onAcceptance={() => fetchNotifications()}
      />
      <TimeRecordActionModal
        id={timeRecordModal.id}
        type={timeRecordModal.type}
        isVisible={timeRecordModal.isOpen}
        setIsModalVisible={(isOpen) => setTimeRecordModal({ isOpen })}
        onAcceptance={() => fetchNotifications()}
      />
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: 120,
  },
  wrapper: {
    flexGrow: 1,
    paddingBottom: 24,
    marginLeft: 24,
  },
  skeletonWrapper: {
    zIndex: 1,
    marginTop: 120,
    flexGrow: 1,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 24,
    marginHorizontal: 24,
  },
})
