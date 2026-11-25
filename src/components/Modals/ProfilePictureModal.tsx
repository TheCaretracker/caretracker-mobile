import globalStyles from '@/globalStyles'
import DefaultModal from './DefaultModal'
import { usePicturePicker } from '@/hooks/usePicturePicker'
import { Text, View, StyleSheet, Dimensions, Platform } from 'react-native'
import Button from '../Button/Button'

function ProfilePictureModal({
  isModalVisible,
  setIsModalVisible,
  setProfilePicture,
}) {
  const { showPicker } = usePicturePicker(setProfilePicture)
  const screenWidth = Dimensions.get('window').width

  return (
    <DefaultModal
      isVisible={isModalVisible}
      setModalVisible={setIsModalVisible}
    >
      <View style={[styles.modal, { width: screenWidth * 0.8 }]}>
        <Text style={[globalStyles.bodyTextBold, styles.modalTitle]}>
          Profile Picture
        </Text>
        <View style={styles.modalBody}>
          <View style={styles.buttonWrapper}>
            <Button
              text="Delete picture"
              type="secondary"
              onPress={() => {
                setProfilePicture(null)
                setIsModalVisible(false)
              }}
              buttonStyle={[styles.modalButton, styles.cancelButton]}
              textStyle={styles.cancelButtonText}
            />
            <Button
              text="Change"
              type="primary"
              onPress={() => {
                if (Platform.OS === 'android') {
                  setIsModalVisible(false)
                }
                showPicker()
              }}
              buttonStyle={[styles.modalButton, styles.changeButton]}
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
    marginTop: 18,
  },
  info: {
    color: '#375064',
    fontSize: 14,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 136,
  },
  changeButton: {
    backgroundColor: '#4440D6',
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

export default ProfilePictureModal
