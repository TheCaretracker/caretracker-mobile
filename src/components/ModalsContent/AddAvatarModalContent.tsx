import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import Button from '../Button/Button'
import Colors from '@/utils/colors'
import { IAvatarModalContent } from './typesInterfaces'
import { avatars } from '@/assets/images/avatars/avatar'
import { useContext, useState } from 'react'
import { CaredForFormContext } from '@/contexts/CaredForForm/CaredForFormContext'
import CaredForAvatar from '../CaredFor/CaredForAvatar'
import styled from 'styled-components/native'

const AddAvatarModalContent = ({
  valuesProps,
  setFieldValueProps,
  closeModalProps,
}: any) => {
  const { values, setFieldValue, closeModal } = useContext(CaredForFormContext)

  const isAvatarSelected = values?.avatarId !== null
  const buttonColor = isAvatarSelected
    ? Colors.PrimaryPurple
    : Colors.MediumGrey
  const textColor = isAvatarSelected ? 'white' : Colors.BlackText

  const [selectedAvatar, setSelectedAvatar] = useState<number>()

  return (
    <View>
      <Text style={styles.avatarModalTitle}>Choose an Avatar</Text>
      <View style={styles.avatarContainer}>
        {avatars.map((_, index) => (
          <AvatarTouchable
            key={index}
            onPress={() => setSelectedAvatar(index)}
            style={index === selectedAvatar ? styles.selectedAvatar : {}}
          >
            <CaredForAvatar avatar={{ avatarId: index, isAvatar: true }} />
          </AvatarTouchable>
        ))}
      </View>
      <Button
        type="secondary"
        text="Continue without an avatar"
        buttonStyle={styles.withoutAvatar}
        onPress={() => {
          setFieldValue('avatarId', undefined)
          closeModal()
        }}
      />
      <Button
        text="Save"
        disabled={!isAvatarSelected}
        buttonStyle={{ backgroundColor: buttonColor }}
        textStyle={{ color: textColor }}
        onPress={() => {
          setFieldValue('avatarId', selectedAvatar)
          closeModal()
        }}
      />
    </View>
  )
}

const AvatarTouchable = styled.TouchableOpacity`
  width: 66px;
  height: 66px;
`

const styles = StyleSheet.create({
  avatarModalTitle: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: Colors.BlackText,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 9,
    rowGap: 17,
    marginTop: 24,
    marginBottom: 32,
  },
  withoutAvatar: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: Colors.PrimaryPurple,
    borderRadius: 100,
  },
})

export default AddAvatarModalContent
