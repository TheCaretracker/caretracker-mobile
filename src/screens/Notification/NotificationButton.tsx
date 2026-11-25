import Button from '../../components/Button/Button'
import { StyleSheet, View } from 'react-native'

const NotificationButton = ({ setConfirmationModal }) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        text="Accept"
        type="secondary"
        buttonStyle={[styles.button]}
        onPress={() =>
          setConfirmationModal({
            isOpen: true,
            type: 'accept',
          })
        }
      />
      <Button
        text="Decline"
        buttonStyle={[styles.button, { backgroundColor: 'transparent' }]}
        textStyle={{ color: '#4440D6' }}
        onPress={() =>
          setConfirmationModal({
            isOpen: true,
            type: 'decline',
          })
        }
      />
    </View>
  )
}

export default NotificationButton

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 0,
    height: 30,
  },
})
