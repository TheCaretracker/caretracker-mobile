import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { CreateAccountContext } from '@/contexts/CreateAccountContext'
import { Button, CustomSelect, InputField } from '@/components'
import { USStates } from '@/utils/USStates'
import CreateAccountLayout from '@/layouts/CreateAccountLayout'
import { createAccountValidation } from './helper'
import { locationSchema } from './schema'

const Location = ({ navigation }: any) => {
  const { values, handleChange, handleSubmit, isSubmitting } =
    useContext(CreateAccountContext)

  const { errors, handleBlur, validateForm } = createAccountValidation({
    schema: locationSchema,
    values,
  })

  return (
    <CreateAccountLayout
      navigation={navigation}
      title={'Location'}
      button={
        <Button
          busy={isSubmitting}
          text="Save & Create Account"
          onPress={async () => {
            if (await validateForm()) {
              handleSubmit()
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
        Please add your location for better experience.
      </Text>
      <View
        style={{
          flexDirection: 'column',
          gap: 22,
          alignItems: 'center',
          marginTop: 30,
        }}
      >
        <InputField
          placeholder="City"
          value={values.address?.city}
          onChangeText={handleChange('address.city')}
          error={errors['address.city']}
          onBlur={handleBlur('address.city')}
        />
        <CustomSelect
          options={USStates}
          selectedValue={values.address?.state}
          onSelect={handleChange('address.state')}
          label="State"
          error={errors['address.state']}
          onBlur={handleBlur('address.state')}
        />
      </View>
    </CreateAccountLayout>
  )
}

export default Location
