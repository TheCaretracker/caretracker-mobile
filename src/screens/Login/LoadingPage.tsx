import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { LoadingSpinner } from '@/components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const LoadingPage = ({ navigation }: any) => {
  const insets = useSafeAreaInsets()

  const backgroundStyle = {
    backgroundColor: '#4440D6',
    flex: 1,
    paddingBottom: insets.bottom,
  }

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <LoadingSpinner />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  text: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
  },
})

export default LoadingPage
