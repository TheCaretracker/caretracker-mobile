import { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import InputField from '../InputField/InputField'
import DaysSelect from '../SelectOption/DaysSelect'
import TimeInput from '../InputField/TimeInput'
import Button from '../Button/Button'
import { TMedicTime, TActivityData } from './typesInterfaces'
import { RemoveIcon } from '@/assets/icons/icon'
import Colors from '@/utils/colors'
import { useFormik } from 'formik'
import { Activity } from '@/types/caredFor'
import ModalContent from './ModalContent'
import { activitySchema } from '@/screens/CaredFor/AddEditCaredFor/schema'

const AddActivityModalContent = ({
  onSubmit,
  onRemove,
  initialValues,
  modalProps,
  closeModalProps,
}) => {
  const { values, handleChange, setFieldValue, handleSubmit, errors } =
    useFormik<Activity>({
      initialValues: initialValues,
      onSubmit: onSubmit,
      validationSchema: activitySchema,
      validateOnBlur: true,
      validateOnChange: false,
      validateOnMount: false,
    })

  return (
    <ModalContent
      handleSubmit={handleSubmit}
      handleRemove={onRemove}
      modalProps={modalProps}
      closeModalProps={closeModalProps}
    >
      <InputField
        placeholder="Activity name (required)"
        inputType="text"
        value={values.name}
        onChangeText={handleChange('name')}
        error={errors.name}
      />
      <InputField
        placeholder="Location (optional)"
        inputType="text"
        value={values.location}
        onChangeText={handleChange('location')}
      />
      <View style={styles.twoColumnRow}>
        <TimeInput
          placeholder="Start"
          value={values?.startTime}
          setFieldValue={(value) => setFieldValue('startTime', value)}
          error={errors.startTime}
        />
        <TimeInput
          placeholder="End"
          value={values?.endTime}
          setFieldValue={(value) => setFieldValue('endTime', value)}
          error={errors.endTime}
        />
      </View>
      <DaysSelect
        onSelectionChange={(value) => setFieldValue('days', value)}
        initialSelectedDays={values?.days}
      />
    </ModalContent>
  )
}

const styles = StyleSheet.create({
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
    width: '100%',
  },
})

export default AddActivityModalContent
