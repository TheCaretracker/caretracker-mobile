import DefaultModal from '@/components/Modals/DefaultModal'
import { CaredForFormContext } from '@/contexts/CaredForForm/CaredForFormContext'
import { useContext } from 'react'
import { styles } from './Styles'
import { ScrollView } from 'react-native'
import {
  AddActivityModalContent,
  AddAllergyModalContent,
  AddAvatarModalContent,
  AddFeedingModalContent,
  AddMedicationModalContent,
  AddNapModalContent,
} from '@/components/ModalsContent'

const AssociationModal = ({
  modalProps,
  valuesProps,
  setFieldValueProps,
  closeModalProps,
}: any) => {
  const { modal, values, contacts, setFieldValue, closeModal } =
    useContext(CaredForFormContext)
  const initialValues =
    modal.itemIndex !== undefined ? values[modal.content][modal.itemIndex] : {}

  const isEditing = values.id != null

  const renderModalContent = () => {
    if (!modal.content) {
      return null
    }
    const Content = {
      avatar: AddAvatarModalContent,
      medications: AddMedicationModalContent,
      allergies: AddAllergyModalContent,
      feedingTimes: AddFeedingModalContent,
      napTimes: AddNapModalContent,
      activities: AddActivityModalContent,
    }[modal.content]

    const handleRemove = () => {
      const newContent = [...values[modal.content]]

      if (isEditing) {
        newContent[modal.itemIndex]._destroy = true
      } else {
        newContent.splice(modal.itemIndex, 1)
      }

      setFieldValue(modal.content, newContent)
      closeModal()
    }

    const handleSubmit = (value) => {
      if (modal.itemIndex !== undefined) {
        const newContent = [...values[modal.content]]
        newContent.splice(modal.itemIndex, 1, value)

        setFieldValue(modal.content, newContent)
      } else {
        setFieldValue(modal.content, [...values[modal.content], value])
      }

      closeModal()
    }

    return (
      <Content
        modalProps={modal}
        closeModalProps={closeModal}
        initialValues={initialValues}
        onSubmit={(value) => {
          handleSubmit(value)
        }}
        onRemove={handleRemove}
        contacts={contacts}
      />
    )
  }

  return (
    <DefaultModal
      isVisible={modal.isOpen}
      setModalVisible={() => closeModal()}
      modalstyle={styles.modalStyle}
      avoidKeyboard
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderModalContent()}
      </ScrollView>
    </DefaultModal>
  )
}

export default AssociationModal
