import { Image, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Avatar from './Avatar'

function BlankProfilePicture() {
  return (
    <View
      style={{
        marginVertical: '35%',
        marginHorizontal: '10%',
      }}
    >
      <Text
        style={{
          color: '#6D767C',
          fontSize: 12,
          fontFamily: 'Outfit-Regular',
          textAlign: 'center',
        }}
      >
        Upload picture
      </Text>
      <Text
        style={{
          color: '#6D767C',
          fontSize: 10,
          fontFamily: 'Outfit-Regular',
          textAlign: 'center',
        }}
      >
        (Optional)
      </Text>
    </View>
  )
}

function ProfilePicture({ profilePicture }) {
  return (
    <View
      style={{
        position: 'relative',
      }}
    >
      <Avatar source={profilePicture} />
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.00)', 'rgba(0, 0, 0, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontFamily: 'Outfit-SemiBold',
              marginBottom: 4,
            }}
          >
            EDIT
          </Text>
        </LinearGradient>
      </View>
    </View>
  )
}

const UploadPicture = ({ handleProfilePictureEdit, avatar }) => {
  return (
    <TouchableOpacity
      style={{
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: '#EAEBEC',
        overflow: 'hidden',
      }}
      onPress={handleProfilePictureEdit}
    >
      {avatar ? (
        <ProfilePicture profilePicture={avatar} />
      ) : (
        <BlankProfilePicture />
      )}
    </TouchableOpacity>
  )
}

export default UploadPicture
