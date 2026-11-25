import React, { forwardRef, useState } from 'react'
import {
  View,
  TextInput,
  TextInputProps,
  GestureResponderEvent,
  Platform,
} from 'react-native'
import styled from 'styled-components/native'
import Colors from '@/utils/colors'
import { Eye, CrossedEye } from '@/assets/icons/icon'
import InputAddon from './InputAddon'
import ValidationError from '../Error/ValidationError'

interface IInputFieldProps extends TextInputProps {
  inputType?: string
  leftIcon?: any
  rightIcon?: React.ComponentType<any>
  onPressRightIcon?: (event: GestureResponderEvent) => void
  customRightIcon?: any
  error?: string
  isActive?: boolean
}

const InputField = forwardRef<TextInput, IInputFieldProps>(
  (
    {
      inputType,
      value,
      placeholder,
      leftIcon,
      rightIcon: RightIcon = null,
      onPressRightIcon = null,
      children,
      customRightIcon,
      error,
      isActive = false,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [hidePassword, setHidePassword] = useState<boolean>(true)
    const [onFocus, setOnFocus] = useState(false)

    const renderRightIcon = () => {
      const renderIconView = (onPressCallback, Icon) => {
        return (
          <View pointerEvents={onPressCallback == null ? 'none' : 'auto'}>
            <RightIconView onPress={onPressCallback}>
              <Icon style={{ color: Colors.DarkGrey }} />
            </RightIconView>
          </View>
        )
      }

      if (inputType === 'password') {
        return renderIconView(
          () => setHidePassword((value) => !value),
          hidePassword ? Eye : CrossedEye
        )
      }

      if (RightIcon) {
        return renderIconView(onPressRightIcon, RightIcon)
      }

      return null
    }

    const renderAddons = () => {
      const rightAddon = React.Children.toArray(children).find((child) => {
        if (React.isValidElement(child)) {
          return child.type === InputAddon
        }
        return false
      })
      return rightAddon
    }

    const renderLeftIcon = (Icon) => {
      if (!Icon || !value) return
      return (
        <View>
          <LeftIconView>
            <Icon />
          </LeftIconView>
        </View>
      )
    }

    const renderCustomRightIcon = (Icon) => {
      if (!Icon) return
      return (
        <View>
          <RightIconView>
            <Icon />
          </RightIconView>
        </View>
      )
    }

    return (
      <Container>
        <FieldContainer
          multiline={rest.multiline}
          error={error}
          isActive={isActive || onFocus}
        >
          {value && (
            <FloatingLabel maxFontSizeMultiplier={1.1}>
              {placeholder}
            </FloatingLabel>
          )}
          {renderLeftIcon(leftIcon)}
          <Input
            ref={ref}
            autoCapitalize={inputType === 'email' ? 'none' : null}
            autoCorrect={false}
            secureTextEntry={inputType === 'password' && hidePassword}
            placeholder={placeholder}
            value={value}
            placeholderTextColor={Colors.DarkGrey}
            onFocus={() => setOnFocus(true)}
            onBlur={(e) => {
              if (onBlur) onBlur(e)
              setOnFocus(false)
            }}
            autoComplete="off"
            importantForAutofill="no"
            allowFontScaling={false}
            {...rest}
            style={[
              rest.style,
              Platform.OS === 'android' && {
                textAlignVertical: 'center',
                includeFontPadding: false,
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
              },
            ]}
          />
          {renderRightIcon() ||
            renderAddons() ||
            renderCustomRightIcon(customRightIcon)}
        </FieldContainer>
        {error && (
          <ValidationErrorContainer>
            <ValidationError error={error} />
          </ValidationErrorContainer>
        )}
      </Container>
    )
  }
)

const ValidationErrorContainer = styled.View`
  margin-left: 16px;
`

const Container = styled.View`
  flex-shrink: 1;
  width: 100%;
`
const FloatingLabel = styled.Text`
  color: ${Colors.PrimaryBlue};
  font-family: 'Outfit-Regular';
  font-size: 10px;
  position: absolute;
  left: 16px;
  top: 5px;
`

const FieldContainer = styled.View<IInputFieldProps>`
  height: ${(props) => (props.multiline ? '100px' : '44px')};
  border-radius: ${(props) => (props.multiline ? '8px' : '100px')};
  border-width: 1px;
  border-color: ${(props) =>
    props.error
      ? Colors.Red
      : props.isActive
        ? Colors.PrimaryPurple
        : Colors.LightGrey};
  background-color: white;
  font-size: 14px;
  padding-left: 16px;
  padding-right: ${(props) => (props.multiline ? '16px' : '0')};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`
const Input = styled.TextInput.attrs({})`
  font-family: 'Outfit-Regular';
  color: ${Colors.BlackText};
  flex: 1;
  margin-top: ${(props) =>
    props.multiline && props.value ? '20px' : props.value ? '10px' : '0px'};
  height: ${(props) => (props.multiline ? '90px' : 'auto')};
  padding-bottom: ${(props) =>
    props.multiline && props.value ? '16px' : '0px'};
  text-align-vertical: ${(props) => (props.multiline ? 'top' : 'center')};
`
const RightIconView = styled.TouchableOpacity`
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  margin: 16px;
`
const LeftIconView = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: 10px;
  margin-right: 8px;
`

export default InputField
