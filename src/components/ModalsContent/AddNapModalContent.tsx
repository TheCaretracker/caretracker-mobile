import { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import CustomSelect from '../CustomSelect/CustomSelect'
import TimeInput from '../InputField/TimeInput'
import Button from '../Button/Button'
import { TMedicTime, TNapTimeData } from './typesInterfaces'
import { RemoveIcon } from '@/assets/icons/icon'
import Colors from '@/utils/colors'
import { NapTime } from '@/types/caredFor'
import { useFormik } from 'formik'
import ModalContent from './ModalContent'
import { napTimeSchema } from '@/screens/CaredFor/AddEditCaredFor/schema'

interface INapModalContent {
  handleCancelNapTime?: () => void
  handleSaveNapTime?: (data: TNapTimeData, index?: number) => void
  prevNapPeriod?: string
  prevNapStartTime?: string
  prevNapEndTime?: string
  index?: number
  handleRemoveNapTime?: (index?: number) => void
}

const options = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Afternoon', value: 'Afternoon' },
  { label: 'Evening', value: 'Evening' },
  { label: 'Night', value: 'Night' },
]

const AddNapModalContent = ({
  onSubmit,
  initialValues,
  onRemove,
  modalProps,
  closeModalProps,
}) => {
  const { values, setFieldValue, handleSubmit, errors } = useFormik<NapTime>({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validationSchema: napTimeSchema,
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
      <CustomSelect
        label="Period"
        options={options}
        selectedValue={values?.period}
        onSelect={(value) => setFieldValue('period', value)}
        useSearch={false}
        useDropdownStyle
        error={errors.period}
      />
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
    </ModalContent>
  )
}

export default AddNapModalContent
