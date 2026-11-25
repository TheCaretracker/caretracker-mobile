import OTPInputView from '@twotalltotems/react-native-otp-input'
import { StyleSheet, View } from 'react-native'

interface OTPInputProps {
  value: string
  setValue: (value: string) => void
  numOfDigits: number
}

const OTPInput: React.FC<OTPInputProps> = ({
  value = '',
  setValue,
  numOfDigits = 4,
}) => {
  return (
    <View style={styles.container}>
      <OTPInputView
        style={styles.main}
        pinCount={numOfDigits}
        code={value}
        keyboardType="number-pad"
        autoFocusOnLoad={false}
        onCodeChanged={(value) => setValue(value)}
        codeInputFieldStyle={styles.codeInput}
        codeInputHighlightStyle={styles.inputHighlight}
      ></OTPInputView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    alignItems: 'center',
    marginVertical: 20,
  },
  main: {
    width: '100%',
  },
  codeInput: {
    aspectRatio: 1,
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#EAEBEC',
    fontSize: 30,
    fontFamily: 'Outfit-Bold',
    color: 'black',
    fontWeight: '700',
  },
  inputHighlight: {
    borderColor: '#4440D6',
  },
})

export default OTPInput
