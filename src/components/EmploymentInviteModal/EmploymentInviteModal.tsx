import ConfirmationModal from '../Modals/ConfirmationModal'
import Colors from '@/utils/colors'
import { acceptEmploymentInvite } from '@/requests/employmentRequests'

interface EmploymentInviteModalProps {
  id: number
  type: 'accept' | 'decline'
  isVisible: boolean
  setIsModalVisible: (isOpen: boolean) => void
  onCancel?: () => void
  onAcceptance?: () => void
  triggerRefresh?: () => void
}

const EmploymentInviteModal = ({
  id,
  type,
  isVisible,
  setIsModalVisible,
  onCancel,
  onAcceptance,
}: EmploymentInviteModalProps) => {
  const handleConfirm = async () => {
    const { data } = await acceptEmploymentInvite(id, type === 'accept')
    if (data.success) {
      if (onAcceptance) onAcceptance()
      setIsModalVisible(false)
    }
  }

  return (
    <ConfirmationModal
      isModalVisible={isVisible}
      setIsModalVisible={setIsModalVisible}
      primaryButtonStyle={{ backgroundColor: Colors.PrimaryPurple }}
      primaryButtonText={type === 'accept' ? 'Accept' : 'Decline'}
      title={`${type === 'accept' ? 'Accept' : 'Decline'} Invite?`}
      description={`By ${
        type === 'accept' ? 'accepting' : 'declining'
      } this invite, your Employer will be notified.`}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      closeOnConfirm={false}
    />
  )
}

export default EmploymentInviteModal
