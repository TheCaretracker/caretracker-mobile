import React, { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'

interface SkeletonProps {
  width: string | number
  height: number
  variant?: 'box' | 'circle'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant: varient = 'box',
}) => {
  const opacity = useRef(new Animated.Value(0.3))

  let borderRadius = 10
  if (varient === 'circle') {
    borderRadius =
      typeof height === 'string' ? parseInt(height, 10) / 2 : height / 2
  }

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          // easing: Easing.linear.inOut,
          useNativeDriver: true,
          duration: 500,
        }),

        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start()
  }, [opacity])

  return (
    <Animated.View
      style={[
        { opacity: opacity.current, height, width, borderRadius },
        styles.skeleton,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#00000030',
    marginVertical: 4,
  },
})
