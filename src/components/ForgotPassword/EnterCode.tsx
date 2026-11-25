import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native'
import Button from '../Button/Button'
import OTPInput from '../OTPInput/OTPInput'
import { useFormikContext } from 'formik'
import { ForgotPasswordForm } from './ForgotPassword'
import { checkToken } from '@/requests/passwordRequests'
import Timer from './Timer'

const EnterCode = ({ next }) => {
  const [codeExpired, onChangeCodeExpired] = React.useState<boolean>(false)
  const { values, setFieldValue } = useFormikContext<ForgotPasswordForm>()

  const handleSubmit = async () => {
    await checkToken(values)
      .then(({ data }) => {
        if (data.success) {
          next()
        }
      })
      .catch(({ response }) => Alert.alert(response.data.errors[0]))
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChangeCodeExpired(true)
    }, 330000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <View style={{ gap: 8 }}>
        <Text style={styles.heading}>Password recovery</Text>
        <Text style={styles.subheading}>
          Enter the verification code sent to your email.
        </Text>
      </View>
      <OTPInput
        value={values.code}
        setValue={(value: string) => setFieldValue('code', value)}
      />

      <Timer />

      <View style={{ marginTop: '15%' }}>
        <Button text="Submit" onPress={handleSubmit} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: '#2E2E2E',
  },
  subheading: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#375064',
  },
})

export default EnterCode
