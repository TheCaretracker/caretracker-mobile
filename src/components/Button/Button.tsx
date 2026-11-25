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
  ActivityIndicator,
} from 'react-native'
import {
  getButtonStyle,
  getDisabledButtonStyle,
  getDisabledTextStyle,
  getTextStyle,
} from './ButtonConsts'
import Colors from '@/utils/colors'

interface IButtonProps extends TouchableOpacityProps {
  text: string
  buttonStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  disabled?: boolean
  icon?: React.ReactNode
  type?: 'primary' | 'secondary' | 'clock out'
  busy?: boolean
}

const Button = ({
  text,
  buttonStyle,
  textStyle,
  disabled,
  icon,
  type = 'primary',
  busy,
  ...rest
}: IButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        disabled
          ? getDisabledButtonStyle({ styles, buttonStyle })
          : getButtonStyle({ type, styles, buttonStyle }),
        busy ? { opacity: 0.5 } : {},
      ]}
      disabled={disabled || busy}
      {...rest}
    >
      {busy && <ActivityIndicator />}
      {icon}
      <Text
        style={
          disabled
            ? getDisabledTextStyle({ styles })
            : getTextStyle({ type, styles, textStyle })
        }
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
  },
  button: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    columnGap: 10,
    paddingVertical: 10,
    minHeight: 44,
  },
})

export default Button
