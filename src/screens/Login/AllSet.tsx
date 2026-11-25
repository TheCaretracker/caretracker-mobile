import React from 'react'
import { StatusBar, View, Image, Text, StyleSheet } from 'react-native'
import { Button } from '@/components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AllSet = ({ message, onConfirm, buttonTitle }) => {
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
        <Image
          source={require('../../assets/images/onecheck.png')}
          style={{
            width: 61,
            height: 61,
          }}
        />
        <Text style={styles.text}>All set!</Text>
        <Text style={styles.textTwo}>{message}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text={buttonTitle}
          onPress={onConfirm}
          type="secondary"
          buttonStyle={{ backgroundColor: 'white' }}
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
  },
  buttonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: '10%',
  },
})

export default AllSet
