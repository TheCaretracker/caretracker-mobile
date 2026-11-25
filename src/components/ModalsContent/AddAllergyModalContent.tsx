import InputField from '../InputField/InputField'
import SeveritySelect from '../SelectOption/SeveritySelect'
import MultiSelect from '../CustomSelect/MultiSelect'
import { useFormik } from 'formik'
import { Allergy } from '@/types/caredFor'
import ModalContent from './ModalContent'
import { allergySchema } from '@/screens/CaredFor/AddEditCaredFor/schema'

const AddAllergyModalContent = ({
  onSubmit,
  initialValues,
  onRemove,
  modalProps,
  closeModalProps,
  contacts,
}) => {
  const { values, handleChange, setFieldValue, handleSubmit, errors } =
    useFormik<Allergy>({
      initialValues: initialValues,
      onSubmit: onSubmit,
      validationSchema: allergySchema,
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
        placeholder="Type (required)"
        inputType="text"
        value={values?.name}
        onChangeText={handleChange('name')}
        error={errors.name}
      />
      <SeveritySelect
        onSeverityChange={(value) => setFieldValue('severity', value)}
        initialValue={values?.severity}
        error={errors.severity}
      />
      <InputField
        placeholder="Reaction"
        inputType="text"
        value={values?.reaction}
        onChangeText={handleChange('reaction')}
        multiline
      />
      <InputField
        placeholder="Treatment"
        inputType="text"
        value={values?.treatment}
        onChangeText={handleChange('treatment')}
        multiline
      />
      <MultiSelect
        options={contacts}
        placeholder="Emergency Contact"
        initialSelectedValues={values?.allergyContactsAttributes}
        onSelectionChange={(value) => {
          const selectedIds = value?.map((selectedValue) => {
            return { contactId: selectedValue.value }
          })
          setFieldValue('allergyContactsAttributes', selectedIds)
        }}
      />
    </ModalContent>
  )
}

export default AddAllergyModalContent
