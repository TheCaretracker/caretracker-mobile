import { avatars } from '@/assets/images/avatars/avatar'
import Colors from '@/utils/colors'
import { View } from 'react-native'
import styled from 'styled-components/native'

const CaredForAvatar = ({ avatar }) => {
  const getAvatar = () => {
    if (Object.hasOwn(avatar, 'isAvatar')) {
      if (avatar?.isAvatar) {
        const Avatar = avatars[avatar?.avatarId]
        return <Avatar height="100%" width="100%" />
      } else {
        return (
          // numberOfLines is required for adjustsFontSizeToFit under the
          // new architecture (React Native 0.88)
          <InitialsAvatar adjustsFontSizeToFit numberOfLines={1}>
            {avatar?.initials}
          </InitialsAvatar>
        )
      }
    } else {
      const Avatar = avatars[avatar]
      return <Avatar height="100%" width="100%" />
    }
  }

  return <AvatarContainer>{getAvatar()}</AvatarContainer>
}

const AvatarContainer = styled.View`
  background-color: #eaebec;
  flex: 1;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const InitialsAvatar = styled.Text`
  color: ${Colors.BlackText};
  font-size: 40px;
`

export default CaredForAvatar
