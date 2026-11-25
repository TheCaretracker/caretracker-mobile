import React from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import Button from '../Button/Button'
import InputField from '../InputField/InputField'
import { useFormikContext } from 'formik'
import { ForgotPasswordForm } from './ForgotPassword'
import { forgotPassword } from '@/requests/passwordRequests'

const EnterEmail = ({ next }) => {
  const { values, handleChange, setFieldValue } =
    useFormikContext<ForgotPasswordForm>()

  const handleSubmit = async () => {
    const { data } = await forgotPassword({ email: values.email })

    if (data.success) {
      if (data.debugCode) {
        setFieldValue('code', data.debugCode)
      }
      next()
    }
  }

  return (
    <>
      <View style={{ gap: 8 }}>
        <Text style={styles.heading}>Password recovery</Text>
        <Text style={styles.subheading}>
          Enter the email associated with your account and we'll send
          instructions to reset your password.
        </Text>
      </View>
      <View style={{ marginTop: '10%' }}>
        <InputField
          placeholder="Email"
          value={values.email}
          onChangeText={handleChange('email')}
          autoCapitalize="none"
        />
      </View>
      <View style={{ marginTop: '20%' }}>
        <Button
          text="Submit"
          onPress={() => handleSubmit()}
          disabled={!values.email}
        />
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

export default EnterEmail
