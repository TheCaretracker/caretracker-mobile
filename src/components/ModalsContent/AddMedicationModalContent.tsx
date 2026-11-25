import { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import InputField from '../InputField/InputField'
import DaysSelect from '../SelectOption/DaysSelect'
import TimeInput from '../InputField/TimeInput'
import Button from '../Button/Button'
import { TMedicTime, TMedicationsData } from './typesInterfaces'
import { RemoveIcon } from '@/assets/icons/icon'
import Colors from '@/utils/colors'
import { useFormik } from 'formik'
import { Medication } from '@/types/caredFor'
import ModalContent from './ModalContent'
import { medicationSchema } from '@/screens/CaredFor/AddEditCaredFor/schema'

interface IAddMedicModalContent {
  onSubmit: (values: Medication) => void
  initialValues: Medication
  onRemove: () => void
  modalProps: any
  closeModalProps: any
}

const AddMedicationModalContent = ({
  onSubmit,
  initialValues,
  onRemove,
  modalProps,
  closeModalProps,
}: IAddMedicModalContent) => {
  const { values, handleChange, setFieldValue, handleSubmit, errors } =
    useFormik<Medication>({
      initialValues: initialValues,
      onSubmit: onSubmit,
      validationSchema: medicationSchema,
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
        placeholder="Medication name (required)"
        inputType="text"
        value={values?.name}
        onChangeText={handleChange('name')}
        error={errors.name}
      />
      <View style={styles.twoColumnRow}>
        <InputField
          placeholder="Dose"
          inputType="text"
          value={values?.dose}
          onChangeText={handleChange('dose')}
          error={errors.dose}
        />
        <TimeInput
          placeholder="Time"
          value={values?.time}
          setFieldValue={(value) => setFieldValue('time', value)}
          error={errors.time}
        />
      </View>
      <DaysSelect
        onSelectionChange={(selected) => setFieldValue('days', selected)}
        initialSelectedDays={values?.days}
      />
    </ModalContent>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    alignItems: 'flex-start',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
    width: '100%',
  },
  top8: {
    marginTop: 8,
  },
  halfWidth: {
    width: '47%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginLeft: 4,
  },
  removeText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    textDecorationLine: 'underline',
    color: Colors.Red,
  },
})

export default AddMedicationModalContent
