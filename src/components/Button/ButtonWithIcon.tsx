import globalStyles from '@/globalStyles'
import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
  ViewProps,
  TextProps,
  StyleProp,
} from 'react-native'
import { getButtonStyle, getTextStyle } from './ButtonConsts'

interface IButtonProps extends TouchableOpacityProps {
  text: string
  buttonStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  disabled?: boolean
  icon?: React.ReactNode
  count?: React.ReactNode
  type?: 'primary' | 'secondary'
}

const ButtonWithIcon = ({
  text,
  buttonStyle,
  textStyle,
  disabled,
  icon,
  count,
  type = 'secondary',
  ...rest
}: IButtonProps) => {
  return (
    <TouchableOpacity
      style={
        disabled
          ? [
              getButtonStyle({ type, styles, buttonStyle }),
              styles.disabledButton,
            ]
          : getButtonStyle({ type, styles, buttonStyle })
      }
      disabled={disabled}
      {...rest}
    >
      <Text
        style={getTextStyle({ type, styles, textStyle })}
        maxFontSizeMultiplier={1}
      >
        {text}
      </Text>
      {count}
      {icon}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: 'black',
  },
  button: {
    display: 'flex',
    borderRadius: 100,
    height: 30,
    width: 89,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.3,
  },
})

export default ButtonWithIcon
