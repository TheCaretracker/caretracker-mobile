import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { BackButtonHeader, Button, InputField } from '@/components'
import { useFormik } from 'formik'
import Yup from '@/yup/yup'
import { camelToSnake } from '@/utils/case'
import { resetPassword } from '@/requests/passwordRequests'
import { Alert } from 'react-native'
import { useContext } from 'react'
import { UserDataContext, Role } from '@/contexts/UserDataContext'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ChangePasswordScreen = ({ navigation }: any) => {
  const screenWidth = Dimensions.get('window').width
  const { performLogout } = useContext(UserDataContext)

  const insets = useSafeAreaInsets()

  // Yup validation for password change
  const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, 'Password must have a minimum of 8 characters')
      .required('Password cannot be empty'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please enter password again!'),
  })

  const savePasswordChanges = async (values) => {
    const formattedValues = camelToSnake(values)
    const { data } = await resetPassword(formattedValues)

    if (data.success) {
      await performLogout()
    } else {
      const error = data.errors[0]
      Alert.alert('Error!', error)
    }
  }

  const { values, handleChange, handleSubmit, errors, touched, handleBlur } =
    useFormik({
      initialValues: {
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: '',
      },
      onSubmit: (values) => savePasswordChanges(values),
      enableReinitialize: true,
      validationSchema: passwordSchema,
    })
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom },
        ]}
      >
        <BackButtonHeader header="Change Password" navigation={navigation} />
        <View style={styles.wrapper}>
          <View
            style={{
              flexDirection: 'column',
              gap: 22,
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: screenWidth * 0.88,
            }}
          >
            <InputField
              placeholder="Current Password"
              inputType="password"
              value={values.currentPassword}
              onChangeText={handleChange('currentPassword')}
              onBlur={handleBlur('currentPassword')}
              error={touched.currentPassword && errors.currentPassword}
            />
            <InputField
              placeholder="New Password"
              inputType="password"
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              error={touched.newPassword && errors.newPassword}
            />
            <InputField
              placeholder="Confirm Password"
              inputType="password"
              value={values.passwordConfirmation}
              onChangeText={handleChange('passwordConfirmation')}
              onBlur={handleBlur('passwordConfirmation')}
              error={
                touched.passwordConfirmation && errors.passwordConfirmation
              }
            />
          </View>
          <View style={{ flexGrow: 1 }} />
          <View
            style={{
              width: screenWidth * 0.88,
            }}
          >
            <Button
              text="Save changes"
              type="primary"
              onPress={() => {
                Alert.alert(
                  'Change password?',
                  '',
                  [
                    {
                      text: 'Yes',
                      onPress: async () => {
                        try {
                          handleSubmit()
                        } catch (e) {
                          console.log({ e })
                        }
                      },
                    },
                    { text: 'No', onPress: () => {} },
                  ],
                  { cancelable: true }
                )

                // handleSubmit()
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
})

export default ChangePasswordScreen
