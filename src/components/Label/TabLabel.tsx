import React from 'react'
import { Text } from 'react-native'

interface Props {
  label: string
  focused: boolean
}

const TabLabel = ({ label, focused }: Props) => (
  <Text
    style={{
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: focused ? '600' : '300',
      marginTop: 2,
      textAlign: 'center',
    }}
    numberOfLines={1}
    maxFontSizeMultiplier={1.2}
    ellipsizeMode="tail"
  >
    {label}
  </Text>
)

export default TabLabel
