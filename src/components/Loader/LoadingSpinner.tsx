import * as React from 'react'
import { Animated, Easing } from 'react-native'

export const LoadingSpinner = () => {
  const fadeInValue = new Animated.Value(0)
  const spinValue = new Animated.Value(0)

  Animated.sequence([
    Animated.timing(fadeInValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ]).start()

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 360,
      duration: 300000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start()

  return (
    <Animated.Image
      style={{
        transform: [
          {
            rotate: spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}
      source={require('../../assets/images/spinner.png')}
    />
  )
}

export default LoadingSpinner
