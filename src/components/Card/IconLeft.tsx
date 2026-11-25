import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
  styleProps?: object
  children?: React.ReactNode
  icon?: React.ReactNode
}

const IconLeft = ({ styleProps, icon, children }: Props) => {
  return (
    <View style={styles.cardContainer}>
      {icon}
      <Text style={[styles.bodyTextBold, styles.bodyTextMedium, styleProps]}>
        {children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
  },
  bodyTextMedium: {
    fontSize: 14,
    lineHeight: 17.5,
  },
})

export default IconLeft
