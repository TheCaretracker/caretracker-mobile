import { useContext, useEffect, useState } from 'react'
import AppRoutes from './AppRoutes'
import AuthRoutes from './AuthRoutes'
import { UserDataContext, UserDataProvider } from '@/contexts/UserDataContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BiometricOption, {
  BiometricType,
} from '@/screens/Login/Biometric/BiometricOption'
import { AppConsts } from '@/utils/AppConsts'
import AllSet from '@/screens/Login/AllSet'
import { Platform } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import LoadingPage from '@/screens/Login/LoadingPage'

const Routes = () => {
  const { userData, loading } = useContext(UserDataContext)
  const [biometricEnabled, setBiometricEnabled] = useState<Boolean>(false)
  const [firstTime, setFirstTime] = useState<Boolean>(true)
  const [types, setTypes] = useState<LocalAuthentication.AuthenticationType[]>(
    []
  )

  const getPriorityBiometricType = (): BiometricType => {
    const isIOS = Platform.OS === 'ios'
    let type: BiometricType = null

    if (types.length == 0) {
      // No biometrics available
      return null
    }

    if (
      isIOS &&
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      // If platform is iOS and has 'FaceID' capabilities
      type = BiometricType.FaceID
    } else {
      // If Platform is iOS or Android with 'FingerPrint' capabilities
      type = BiometricType.FingerPrint
    }

    return type
  }

  const getSupportedBiometrics = async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    console.log('Supported biometrics', types)
    if (types && types.length > 0) {
      setTypes(types)
    }
  }

  const renderBiometricConfirmation = () => {
    const biometricType = getPriorityBiometricType()

    if (firstTime && biometricType != null) {
      if (!biometricEnabled) {
        return (
          <BiometricOption
            type={biometricType}
            onEnable={() => {
              console.log('Enabling biometric')
              AsyncStorage.setItem(AppConsts.isBiometricEnabled, 'true')
              AsyncStorage.setItem(AppConsts.isFirstTime, 'false')
              setBiometricEnabled(true)
            }}
            onCancel={() => {
              console.log('Canceling biometric')
              AsyncStorage.setItem(AppConsts.isBiometricEnabled, 'false')
              AsyncStorage.setItem(AppConsts.isFirstTime, 'false')
              setBiometricEnabled(false)
              setFirstTime(false)
            }}
          />
        )
      } else {
        return showAllSetScreen()
      }
    } else {
      return <AppRoutes />
    }
  }

  const showAllSetScreen = () => {
    const typeName =
      getPriorityBiometricType() === BiometricType.FaceID
        ? 'Face ID'
        : 'Fingerprint'
    return (
      <AllSet
        message={'Use your ' + typeName + ' next time you sign in.'}
        onConfirm={() => {
          setFirstTime(false)
          setBiometricEnabled(true)
        }}
        buttonTitle={'Ok'}
      />
    )
  }

  useEffect(() => {
    readData()
    getSupportedBiometrics()
  }, [])

  const readData = async () => {
    try {
      const isFirstTime = await AppConsts.getIsFirstTime()
      const isBiometricEnabled = await AppConsts.getIsBiometricEnabled()
      console.log('IS_FRIST_TIME', isFirstTime)
      console.log('IS_BIOMETRIC_TIME', isBiometricEnabled)
      setFirstTime(isFirstTime)

      setBiometricEnabled(isBiometricEnabled)
    } catch (e) {
      alert('Failed to fetch the input from storage')
    }
  }

  // Render logic
  return loading ? (
    <LoadingPage />
  ) : userData ? (
    renderBiometricConfirmation()
  ) : (
    <AuthRoutes isFirstTime={firstTime} />
  )
}

export default Routes
