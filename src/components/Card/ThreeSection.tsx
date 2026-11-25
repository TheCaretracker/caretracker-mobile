import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface SectionContent {
  left?: React.ReactNode
  middle?: React.ReactNode
  right?: React.ReactNode
}

interface Props {
  styleProps?: object
  children?: React.ReactNode
  icon?: React.ReactNode
  object?: SectionContent
}

const ThreeSection = ({ styleProps, object }: Props) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
        <View>{object?.left}</View>
        <Text style={[styles.bodyTextBold, styles.bodyTextMedium]}>
          {object?.middle}
        </Text>
      </View>
      <View style={styles.rightSection}>{object?.right}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightSection: {},
  leftSection: {
    flex: 1,
    flexDirection: 'row',
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

export default ThreeSection
