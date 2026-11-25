import { Button, OTPInput } from '@/components'
import DefaultModal from '@/components/Modals/DefaultModal'
import globalStyles from '@/globalStyles'
import { acceptInvite } from '@/requests/employmentRequests'
import { useState } from 'react'
import { StyleSheet, Text } from 'react-native'

const InviteModal = ({ isVisible, setModalVisible, onSuccess }) => {
  const [value, setValue] = useState<string>()
  const handleSubmit = async () => {
    const { data } = await acceptInvite(value)

    if (data.success) {
      if (onSuccess) onSuccess()
      setModalVisible(false)
    }
  }
  return (
    <DefaultModal
      isVisible={isVisible}
      setModalVisible={setModalVisible}
      avoidKeyboard
    >
      <Text style={[globalStyles.bodyTextBold, styles.modalTitle]}>
        Add Employer
      </Text>
      <Text style={styles.descriptionText}>
        Please provide the invite code sent by your employer
      </Text>
      <OTPInput value={value} setValue={setValue} numOfDigits={6} />
      <Button text={'Submit'} onPress={handleSubmit} />
    </DefaultModal>
  )
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 24,
    color: '#2e2e2e',
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
})

export default InviteModal
