import { BackIcon } from '@/assets/icons/icon'
import {
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CreateAccountLayout = ({ navigation, title, children, button }) => {
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1, paddingBottom: insets.bottom }}
    >
      <View style={backgroundStyle}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              padding: 24,
              justifyContent: 'flex-end',
            }}
          >
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />

            <TouchableOpacity
              style={{ padding: 6 }}
              onPress={() => navigation.goBack()}
            >
              <BackIcon
                style={{
                  width: 24,
                  height: 24,
                  marginVertical: 24,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: '#2E2E2E',
                fontSize: 24,
                fontFamily: 'Outfit-SemiBold',
                marginBottom: 8,
              }}
            >
              {title}
            </Text>

            {children}
            <View style={{ flex: 1 }} pointerEvents="none" />
            <View style={{ marginTop: 25 }}>{button}</View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAwareScrollView>
  )
}

const backgroundStyle = {
  backgroundColor: '#F8F8F8',
  flex: 1,
}

export default CreateAccountLayout
