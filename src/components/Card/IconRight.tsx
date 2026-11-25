import globalStyles from '@/globalStyles'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
  styleProps?: object
  children?: React.ReactNode
  icon?: React.ReactNode
  additionalInfo?: React.ReactNode
}

const IconRight = ({ styleProps, icon, children, additionalInfo }: Props) => {
  return (
    <View style={styles.cardContainer}>
      <View>
        <Text style={[styles.bodyTextBold, styles.bodyTextMedium, styleProps]}>
          {children}
        </Text>
        {additionalInfo && (
          <Text style={[globalStyles.bodyTextRegular, styles.additionalInfo]}>
            {additionalInfo}
          </Text>
        )}
      </View>
      {icon}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
    lineHeight: 17.5,
  },
  bodyTextMedium: {
    fontSize: 14,
  },
  additionalInfo: {
    fontSize: 12,
    color: '#6D767C',
  },
})

export default IconRight
