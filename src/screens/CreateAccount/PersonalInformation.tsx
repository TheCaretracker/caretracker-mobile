import React, { useContext, useState } from 'react'
import { View, Text } from 'react-native'
import {
  CreateAccountContext,
  CreateAccountContextProps,
} from '@/contexts/CreateAccountContext'
import { Button, InputField } from '@/components'
import globalStyles from '@/globalStyles'
import { usePicturePicker } from '@/hooks/usePicturePicker'
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal'
import UploadPicture from '@/components/Avatar/UploadPicture'
import CreateAccountLayout from '@/layouts/CreateAccountLayout'
import { USIcon } from '@/assets/icons/icon'
import { createAccountValidation } from './helper'
import { personalInformationSchema } from './schema'

const PersonalInformation = ({ navigation }: any) => {
  const { showPicker } = usePicturePicker((value) =>
    setFieldValue('avatar', value)
  )
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { values, handleChange, setFieldValue } =
    useContext<CreateAccountContextProps>(CreateAccountContext)

  const { errors, handleBlur, validateForm } = createAccountValidation({
    schema: personalInformationSchema,
    values,
  })

  const handleProfilePictureEdit = () => {
    if (!values.avatar) {
      showPicker()
    } else {
      setIsModalVisible(true)
    }
  }

  return (
    <CreateAccountLayout
      navigation={navigation}
      title={'Personal Information'}
      button={
        <Button
          text="Continue"
          buttonStyle={globalStyles.primaryButton}
          textStyle={globalStyles.primaryButtonText}
          onPress={async () => {
            if (await validateForm()) {
              navigation.navigate('Location')
            }
          }}
        />
      }
    >
      <Text
        style={{
          color: '#375064',
          fontSize: 14,
          fontFamily: 'Outfit-Regular',
        }}
      >
        Please add your information.
      </Text>
      <View
        style={{
          flexDirection: 'column',
          gap: 22,
          alignItems: 'center',
          marginTop: 30,
        }}
      >
        <UploadPicture
          handleProfilePictureEdit={handleProfilePictureEdit}
          avatar={values.avatar}
        />
        <InputField
          placeholder="Full name"
          value={values.fullName}
          onChangeText={handleChange('fullName')}
          error={errors.fullName}
          onBlur={handleBlur('fullName')}
        />

        <InputField
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={values.phoneNumber}
          onChangeText={handleChange('phoneNumber')}
          leftIcon={USIcon}
          error={errors.phoneNumber}
          onBlur={handleBlur('phoneNumber')}
          textContentType="telephoneNumber"
        />
      </View>

      <ProfilePictureModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setProfilePicture={(value: { data: string; mime: string }) => {
          setFieldValue('avatar', value)
          setIsModalVisible(false)
        }}
      />
    </CreateAccountLayout>
  )
}

export default PersonalInformation
