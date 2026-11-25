import React from 'react'
import { StatusBar, View, Text, StyleSheet } from 'react-native'
import { Button } from '@/components'
import Colors from '@/utils/colors'
import { FaceID, TouchID } from '@/assets/icons/icon'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Enum declaration for biometric type role
export enum BiometricType {
  FaceID = 'FaceID',
  FingerPrint = 'FingerPrint',
}

interface IProps {
  type: BiometricType
  onEnable: () => void
  onCancel: () => void
}

const BiometricOption = ({ type, onEnable, onCancel }: IProps) => {
  const isFaceID = type === BiometricType.FaceID

  const insets = useSafeAreaInsets()

  const backgroundStyle = {
    backgroundColor: '#4440D6',
    flex: 1,
    paddingBottom: insets.bottom,
  }

  let authenticationTitle = ''
  let message = ''
  switch (type) {
    case 'FaceID':
      authenticationTitle = 'Using Face ID'
      message = 'Use Face ID for faster, easier account access.'
      break

    case 'FingerPrint':
      authenticationTitle = 'Using Fingerprint'
      message = 'Use Fingerprint for faster, easier account access.'
      break

    default:
      break
  }

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        {isFaceID ? (
          <FaceID
            style={{
              width: 64,
              height: 64,
            }}
          />
        ) : (
          <TouchID
            style={{
              width: 64,
              height: 64,
            }}
          />
        )}
        <Text style={styles.text}>{authenticationTitle}</Text>
        <Text style={styles.textTwo}>{message}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text="Enable"
          onPress={onEnable}
          type="secondary"
          buttonStyle={{ backgroundColor: Colors.White }}
        />
        <Button
          text="Cancel"
          onPress={onCancel}
          type="secondary"
          buttonStyle={{ backgroundColor: Colors.SecondaryPurple }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 30,
    marginBottom: 10,
  },
  textTwo: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 22,
  },
  buttonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: '10%',
    gap: 22,
  },
})

export default BiometricOption
