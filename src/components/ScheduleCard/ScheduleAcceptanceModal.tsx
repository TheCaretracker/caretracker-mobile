import { use, useCallback, useEffect, useMemo, useState } from 'react'
import ConfirmationModal from '../Modals/ConfirmationModal'
import {
  acceptDeclineScheduleChangeRequest,
  acceptSchedule,
  showSchedule,
} from '@/requests/scheduleRequests'
import { RecurringEvent } from '@/types/schedule'
import RecurringEventCard from '../RecurringEventCard/RecurringEventCard'
import { Skeleton } from '../Skeleton/Skeleton'
import Colors from '@/utils/colors'
import { AxiosResponse } from 'axios'
import { NotificationTypeEnum } from '@/screens/Notification/NotificationTypeEnum'

interface ScheduleAcceptanceModalProps {
  id: number
  type: 'accept' | 'decline'
  isVisible: boolean
  notification?: any
  setIsModalVisible: (isOpen: boolean) => void
  onCancel?: () => void
  onAcceptance?: () => void
  triggerRefresh?: () => void
}

const ScheduleAcceptanceModal = ({
  id,
  type,
  isVisible,
  notification,
  setIsModalVisible,
  onCancel,
  onAcceptance,
  triggerRefresh,
}: ScheduleAcceptanceModalProps) => {
  const [recurringEvent, setRecurringEvent] = useState<RecurringEvent>()

  useEffect(() => {
    const fetchRecurringEventData = async () => {
      const { data } = await showSchedule(id)
      if (data.success) {
        setRecurringEvent(data.recurringEvent)
      }
    }
    if (id != null) fetchRecurringEventData()
  }, [id])

  const confirmTitleAndDescription = useMemo(() => {
    if (notification?.type === NotificationTypeEnum.ScheduleChangeRequest) {
      return {
        title: type === 'accept' ? 'Accept Changes' : 'Decline Changes',
        description: `By ${
          type === 'accept' ? 'accepting' : 'declining'
        } these changes, your Employer will be notified.`,
      }
    }
    return {
      title: type === 'accept' ? 'Accept Schedule' : 'Decline Schedule',
      description: `By ${
        type === 'accept' ? 'accepting' : 'declining'
      } this schedule, your Employer will be notified.`,
    }
  }, [notification, type])

  const handleConfirm = useCallback(async () => {
    let response: AxiosResponse<any, any, {}>
    if (notification?.type === NotificationTypeEnum.ScheduleChangeRequest) {
      const requestId = notification?.data?.requestId
      if (!requestId) return
      response = await acceptDeclineScheduleChangeRequest(requestId, {
        accept: type === 'accept',
      })
    } else {
      response = await acceptSchedule(id, { accept: type === 'accept' })
    }
    const { data } = response
    if (data.success) {
      if (onAcceptance) onAcceptance()
      if (triggerRefresh) triggerRefresh()
      setIsModalVisible(false)
    }
  }, [id, notification, type, onAcceptance, triggerRefresh, setIsModalVisible])

  return (
    <ConfirmationModal
      isModalVisible={isVisible}
      setIsModalVisible={setIsModalVisible}
      primaryButtonStyle={{ backgroundColor: Colors.PrimaryPurple }}
      primaryButtonText={type === 'accept' ? 'Accept' : 'Decline'}
      title={confirmTitleAndDescription.title}
      description={confirmTitleAndDescription.description}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      closeOnConfirm={false}
    >
      {recurringEvent ? (
        <RecurringEventCard
          data={recurringEvent}
          title={recurringEvent.employerName}
          showPending={false}
        />
      ) : (
        <Skeleton width="100%" height={80} />
      )}
    </ConfirmationModal>
  )
}

export default ScheduleAcceptanceModal
