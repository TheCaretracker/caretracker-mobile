import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../Button/Button'
import InputField from '../InputField/InputField'
import { useFormikContext } from 'formik'
import { ForgotPasswordForm } from './ForgotPassword'

const ResetPassword = () => {
  const { values, handleChange, submitForm } =
    useFormikContext<ForgotPasswordForm>()

  return (
    <>
      <View>
        <Text style={styles.heading}>New password</Text>
      </View>
      <View style={styles.passwordsContainer}>
        <InputField
          placeholder="Password"
          inputType="password"
          value={values.newPassword}
          onChangeText={handleChange('newPassword')}
        />
        <InputField
          placeholder="Confirm password"
          inputType="password"
          value={values.passwordConfirmation}
          onChangeText={handleChange('passwordConfirmation')}
        />
      </View>
      <View style={{ marginTop: '15%' }}>
        <Button text="Save" onPress={submitForm} />
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
  passwordsContainer: {
    flexDirection: 'column',
    gap: 22,
    marginVertical: 15,
  },
})

export default ResetPassword
