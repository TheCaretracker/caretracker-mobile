import globalStyles from '@/globalStyles'
import Colors from '@/utils/colors'
import React, { useState } from 'react'
import {
  GestureResponderEvent,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'

interface Props {
  styleProps?: object
  header?: string
  text?: string
  value: boolean
  setValue: (value: boolean) => void
}

const CardWithToggle = ({
  styleProps,
  header,
  text,
  value,
  setValue,
}: Props) => {
  const toggleSwitch = () => {
    setValue(!value)
  }

  return (
    <View
      style={[
        globalStyles.cardContainer,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}
    >
      <View style={styles.cardBody}>
        <Text style={[styles.bodyTextBold, styles.bodyTextMedium, styleProps]}>
          {header}
        </Text>
        {text && (
          <Text
            style={[styles.bodyTextRegular, styles.bodyTextSmall, styleProps]}
          >
            {text}
          </Text>
        )}
      </View>
      <View style={styles.switchContainer}>
        <ToggleSwitch
          isOn={value}
          onToggle={toggleSwitch}
          onColor={Colors.PrimaryBlue}
          offColor={Colors.Grey}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardBody: {
    flex: 1,
    gap: 4,
    paddingRight: 12,
  },
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
    lineHeight: 17.5,
  },
  bodyTextRegular: {
    fontFamily: 'Outfit-Regular',
  },
  bodyTextMedium: {
    fontSize: 14,
  },
  bodyTextSmall: {
    fontSize: 12,
    color: 'rgba(55, 80, 100, 1)',
  },
  switchContainer: {
    height: 15,
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    justifyContent: 'center',
  },
})

export default CardWithToggle
