import { UserDataContext } from '@/contexts/UserDataContext'
import { useContext } from 'react'
import {
  Image,
  StyleSheet,
  View,
  Text,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Constants from 'expo-constants'

const backendUrl = Constants.expoConfig?.extra?.API_URL

interface AvatarProps {
  source?: any
  containerStyle?: StyleProp<ViewStyle>
}
const Avatar = ({ source, containerStyle }: AvatarProps) => {
  const { userData } = useContext(UserDataContext)

  const renderImage = (imageSource: ImageSourcePropType) => (
    <Image
      source={imageSource}
      resizeMode={'cover'}
      style={{ aspectRatio: 1, width: '100%' }}
    />
  )

  const renderAvatarFromUserData = (avatar) => {
    if (avatar?.isAvatar) {
      return renderImage({ uri: `${backendUrl}${avatar?.url}` })
    } else {
      return (
        // numberOfLines is required for adjustsFontSizeToFit to shrink the
        // initials under the new architecture (React Native 0.88)
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.initialsAvatar}
        >
          {avatar?.initials}
        </Text>
      )
    }
  }

  const renderAvatar = () => {
    if (source) {
      if (source.isAvatar || source.initials) {
        return renderAvatarFromUserData(source)
      }
      const imageSource = source?.data
        ? { uri: `data:${source.mime};base64,${source.data}` }
        : source

      return renderImage(imageSource)
    }

    const avatar = userData?.avatar
    return renderAvatarFromUserData(avatar)
  }

  return (
    <View style={[styles.container, containerStyle]}>{renderAvatar()}</View>
  )
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#EAEBEC',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  initialsAvatar: {
    color: 'black',
    fontSize: 32,
    textAlign: 'center',
  },
})

export default Avatar
