import { FeedingTime } from '@/types/caredFor'
import { useFormik } from 'formik'
import CustomSelect from '../CustomSelect/CustomSelect'
import TimeInput from '../InputField/TimeInput'
import ModalContent from './ModalContent'
import { feedingTimeSchema } from '@/screens/CaredFor/AddEditCaredFor/schema'

const options = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Afternoon', value: 'Afternoon' },
  { label: 'Evening', value: 'Evening' },
  { label: 'Night', value: 'Night' },
]

const AddFeedingModalContent = ({
  onSubmit,
  initialValues,
  onRemove,
  modalProps,
  closeModalProps,
}) => {
  const { values, setFieldValue, handleSubmit, errors } =
    useFormik<FeedingTime>({
      initialValues: initialValues,
      onSubmit: onSubmit,
      validationSchema: feedingTimeSchema,
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
        minHeight={175}
        error={errors.period}
      />
      <TimeInput
        placeholder="Time"
        value={values?.time}
        setFieldValue={(value) => setFieldValue('time', value)}
        error={errors.time}
      />
    </ModalContent>
  )
}

export default AddFeedingModalContent
