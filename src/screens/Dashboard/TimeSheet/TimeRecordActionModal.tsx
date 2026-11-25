import { useContext, useEffect, useState } from 'react'
import Colors from '@/utils/colors'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import { acceptDeclineTimeRecordRequest } from '@/requests/workEventsRequests'
import { Role, UserDataContext } from '@/contexts/UserDataContext'

interface TimeRecordActionModalProps {
  id: number
  type: 'accept' | 'decline'
  isVisible: boolean
  setIsModalVisible: (isOpen: boolean) => void
  onCancel?: () => void
  onAcceptance?: () => void
  triggerRefresh?: () => void
}

const TimeRecordActionModal = ({
  id,
  type,
  isVisible,
  setIsModalVisible,
  onCancel,
  onAcceptance,
  triggerRefresh,
}: TimeRecordActionModalProps) => {
  const { getRole } = useContext(UserDataContext)
  const currentRole: Role = getRole()
  const userType = currentRole === Role.Employee ? 'Employer' : 'Employee'

  const handleConfirm = async () => {
    const { data } = await acceptDeclineTimeRecordRequest(id, {
      accept: type === 'accept',
    })

    if (data.success) {
      if (onAcceptance) onAcceptance()
      if (triggerRefresh) triggerRefresh()
      setIsModalVisible(false)
    }
  }

  return (
    <ConfirmationModal
      isModalVisible={isVisible}
      setIsModalVisible={setIsModalVisible}
      primaryButtonStyle={{ backgroundColor: Colors.PrimaryPurple }}
      primaryButtonText={type === 'accept' ? 'Accept' : 'Decline'}
      title={`${type === 'accept' ? 'Accept' : 'Decline'} Time Record?`}
      description={`By ${
        type === 'accept' ? 'accepting' : 'declining'
      } this time record, your ${userType} will be notified.`}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      closeOnConfirm={false}
    />
  )
}

export default TimeRecordActionModal
