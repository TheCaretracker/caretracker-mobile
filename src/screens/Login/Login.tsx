import React, { useContext, useMemo, useState } from 'react'
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { useFormik } from 'formik'
import { UserDataContext } from '@/contexts/UserDataContext'
import { Button, ForgotPassword, InputField } from '@/components'

import Logo from '@/assets/images/logoSVG.svg'
import LoginSVG from '@/assets/images/login.svg'
import LoadingPage from './LoadingPage'
import AllSet from './AllSet'
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppConsts } from '@/utils/AppConsts'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface LoadingScreenState {
  isLoading: boolean
  allSet: boolean
  allSetMessage: string
}

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const Login = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const [loadingScreen, setLoadingScreen] = useState<LoadingScreenState>({
    isLoading: false,
    allSet: false,
    allSetMessage: '',
  })

  const { performLogin } = useContext(UserDataContext)

  const insets = useSafeAreaInsets()

  const backgroundStyle = {
    backgroundColor: '#F8F8F8',
    flex: 1,
  }

  const handleLogin = async (values) => {
    try {
      await performLogin(values)
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  const tryAutoLogin = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      const isBiometricEnabled = await AppConsts.getIsBiometricEnabled()
      if (isBiometricEnabled) {
        authenticateViaBiometric()
      }
    }
  }

  const authenticateViaBiometric = async () => {
    try {
      // Checking if device is compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync()

      if (!isCompatible) {
        throw new Error("Your device isn't compatible.")
      }

      // Checking if device has biometrics records
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()

      if (!isEnrolled) {
        throw new Error('No Faces / Fingers found.')
      }

      // Authenticate user
      let authenticated = await LocalAuthentication.authenticateAsync()

      if (authenticated.success) {
        await performLogin({}, true)
        console.log('Authenticated', 'Welcome back!')
      } else {
        if (authenticated.error !== 'user_cancel')
          throw new Error('Authentication Error')
      }
    } catch (error) {
      Alert.alert('An error as occured', error?.message + '! Please try again')
    }
  }

  const isLoadingscreenVisible = useMemo(
    () => loadingScreen.isLoading || loadingScreen.allSet,
    [loadingScreen.isLoading, loadingScreen.allSet]
  )

  const handleLoadingState = (isLoading, result) => {
    if (isLoading) {
      setLoadingScreen((obj) => ({ ...obj, isLoading: true }))
    } else {
      if (result?.success) {
        setTimeout(
          () =>
            setLoadingScreen((obj) => ({
              ...obj,
              allSet: true,
              allSetMessage: result.message,
            })),
          1000
        )
      } else {
        setLoadingScreen((obj) => ({
          ...obj,
          isLoading: false,
        }))
      }
    }
  }

  const { values, handleChange, handleSubmit } = useFormik({
    // initialValues: {
    //   email: 'employer_0@caretracker.com',
    //   password: 'password123',
    // },em
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => handleLogin(values),
    enableReinitialize: true,
  })

  if (isLoadingscreenVisible) {
    return loadingScreen.allSet ? (
      <AllSet
        message={loadingScreen.allSetMessage}
        onConfirm={() =>
          setLoadingScreen((obj) => ({
            ...obj,
            isLoading: false,
            allSet: false,
          }))
        }
        buttonTitle={'Sign in'}
      />
    ) : (
      <LoadingPage />
    )
  }

  return (
    <KeyboardStickyView style={backgroundStyle}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <View style={{ alignSelf: 'center' }}>
            <Logo />
          </View>

          <LoginSVG
            width={screenWidth}
            height={
              insets.bottom === 0 ? screenHeight * 0.4 : screenHeight * 0.45
            }
          />
          <View style={{ height: 16 }} pointerEvents="none" />
          <View style={styles.bottomHalf}>
            <View style={[styles.formContainer]}>
              <Text
                style={{
                  fontFamily: 'Outfit-SemiBold',
                  fontSize: 24,
                  marginLeft: 24,
                  color: '#2E2E2E',
                  marginTop: -35,
                  paddingBottom: 10,
                  lineHeight: 35 * 0.75,
                }}
              >
                Sign in
              </Text>

              <View
                style={{
                  flexDirection: 'column',
                  gap: 22,
                  alignItems: 'center',
                }}
              >
                <InputField
                  placeholder="Email"
                  inputType="email"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                />
                <InputField
                  placeholder="Password"
                  inputType="password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text
                    style={{
                      color: '#375064',
                      fontSize: 12,
                      fontFamily: 'Outfit-Regular',
                      textDecorationLine: 'underline',
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <Button
                  text="Sign in"
                  type="primary"
                  buttonStyle={{ width: '100%', paddingVertical: 0 }}
                  textStyle={{ lineHeight: 35 * 0.75 }}
                  onPress={() => handleSubmit()}
                />
                <Button
                  text="Create Account"
                  type="secondary"
                  buttonStyle={{ width: '100%' }}
                  onPress={() =>
                    navigation.navigate('CreateAccountNavigator', {
                      screen: 'CreateAccount',
                    })
                  }
                />
              </View>
            </View>
            <ForgotPassword
              isVisible={modalVisible}
              setIsVisible={setModalVisible}
              setIsLoading={handleLoadingState}
            />

            <View style={styles.footer}>
              <Text style={styles.termsOfServiceText} maxFontSizeMultiplier={1}>
                By clicking Sign up, you agree to our
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('TermsAndConditionsScreen')}
              >
                <Text
                  style={[
                    styles.termsOfServiceText,
                    { textDecorationLine: 'underline', marginLeft: 3 },
                  ]}
                  maxFontSizeMultiplier={1}
                >
                  Terms and Conditions
                </Text>
              </TouchableOpacity>
              <Text style={styles.termsOfServiceText}>.</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardStickyView>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    alignContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  termsOfServiceText: {
    color: '#375064',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    lineHeight: 18 * 0.75,
  },
  bottomHalf: {
    alignContent: 'center',
    marginHorizontal: 24,
  },
})

export default Login
