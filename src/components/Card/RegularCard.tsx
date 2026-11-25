import globalStyles from '@/globalStyles'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
  styleProps?: object
  children: any
}

const RegularCard = ({ styleProps, children }: Props) => {
  return (
    <View style={[globalStyles.cardContainer, styleProps]}>{children}</View>
  )
}

export default RegularCard
