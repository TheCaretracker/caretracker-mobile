import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native'
import globalStyles from '@/globalStyles'
import DefaultModal from '@/components/Modals/DefaultModal'
import Button from '../Button/Button'

interface ConfirmationModalProps {
  isModalVisible: boolean
  setIsModalVisible: (value: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  closeOnConfirm?: boolean
  primaryButtonText?: string
  secondaryButtonText?: string
  primaryButtonStyle?: StyleProp<ViewStyle>
}
const ConfirmationModal = ({
  isModalVisible,
  setIsModalVisible,
  title,
  description,
  onConfirm,
  onCancel,
  children,
  primaryButtonStyle,
  primaryButtonText = 'Confirm',
  secondaryButtonText = 'Cancel',
  closeOnConfirm = true,
}: ConfirmationModalProps) => {
  const screenWidth = Dimensions.get('window').width

  return (
    <DefaultModal
      isVisible={isModalVisible}
      setModalVisible={setIsModalVisible}
    >
      <View style={[styles.modal, { width: screenWidth * 0.8 }]}>
        <Text style={[globalStyles.bodyTextBold, styles.modalTitle]}>
          {title}
        </Text>
        <View style={styles.modalBody}>
          <Text style={[styles.info, globalStyles.bodyTextRegular]}>
            {description}
          </Text>
          {children ? <View>{children}</View> : null}
          <View style={styles.buttonWrapper}>
            <Button
              text={secondaryButtonText}
              buttonStyle={[styles.modalButton, styles.cancelButton]}
              textStyle={styles.cancelButtonText}
              onPress={() => {
                setIsModalVisible(false)
                if (onCancel) onCancel()
              }}
            />
            <Button
              text={primaryButtonText}
              buttonStyle={[
                styles.modalButton,
                styles.dangerButton,
                primaryButtonStyle,
              ]}
              onPress={() => {
                if (onConfirm) onConfirm()
                if (closeOnConfirm) setIsModalVisible(false)
              }}
            />
          </View>
        </View>
      </View>
    </DefaultModal>
  )
}

const styles = StyleSheet.create({
  modal: { gap: 8, paddingHorizontal: 8 },
  modalTitle: { fontSize: 24, color: '#2e2e2e' },
  modalBody: {
    gap: 32,
  },
  info: {
    color: '#375064',
    fontSize: 14,
  },
  buttonWrapper: {
    gap: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 130,
  },
  dangerButton: {
    backgroundColor: '#FD5252',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#DED2FF',
    color: '#4440D6',
  },
  cancelButtonText: {
    color: '#4440D6',
  },
})

export default ConfirmationModal
