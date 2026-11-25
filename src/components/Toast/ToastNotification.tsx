import { StyleSheet } from 'react-native'
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastProps,
} from 'react-native-toast-message'
import Colors from '@/utils/colors'

const toastConfig = {
  save: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: Colors.LightGreen,
        borderLeftColor: Colors.LightGreen,
      }}
      text1Style={[styles.textStyle, styles.saveTextColor]}
    />
  ),
  alert: (props) => (
    <InfoToast
      {...props}
      style={{
        backgroundColor: Colors.LightYellow,
        borderLeftColor: Colors.LightYellow,
      }}
      text1Style={[styles.textStyle, styles.alertTextColor]}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: Colors.LightRed,
        borderLeftColor: Colors.LightRed,
      }}
      text1Style={[styles.textStyle, styles.errorTextColor]}
    />
  ),
}

const ToastNotification = ({
  position,
  bottomOffset,
  topOffset,
  visibilityTime = 2000,
}: ToastProps) => {
  return (
    <Toast
      position={position}
      bottomOffset={bottomOffset}
      topOffset={topOffset}
      visibilityTime={visibilityTime}
      config={toastConfig}
    />
  )
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
  },
  saveTextColor: {
    color: Colors.DeepGreen,
  },
  alertTextColor: {
    color: Colors.DeepYellow,
  },
  errorTextColor: {
    color: Colors.DeepRed,
  },
})

export default ToastNotification
