import {
  createCaredFor,
  showCaredFor,
  updateCaredFor,
} from '@/requests/caredForRequests'
import { CaredForData } from '@/types/caredFor'
import { FormikProps, useFormik } from 'formik'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { formatCaredForFormToApi } from './helper'
import { Alert } from 'react-native'
import { CaredForContext } from '../CaredForContext'
import { caredForSchema } from '@/screens/CaredFor/AddEditCaredFor/schema'
import { listContacts } from '@/requests/contactRequests'
import { useFocusEffect } from '@react-navigation/native'

interface CaredForFormContextProps
  extends Pick<
    FormikProps<CaredForData>,
    | 'values'
    | 'handleSubmit'
    | 'handleChange'
    | 'setFieldValue'
    | 'errors'
    | 'validateForm'
  > {
  modal: AssociationModal
  openModal: (props: { content: Content; itemIndex?: number }) => void
  closeModal: () => void
  handleRemove: (associationId: string) => void
  isEditing: boolean
  contacts: []
}

export enum Content {
  Avatar = 'avatar',
  Allergies = 'allergies',
  Medications = 'medications',
  FeedingTimes = 'feedingTimes',
  NapTimes = 'napTimes',
  Activities = 'activities',
}
interface AssociationModal {
  isOpen: boolean
  content?: Content
  itemIndex?: number
}
export const CaredForFormContext = createContext<CaredForFormContextProps>(null)

export const CaredForFormProvider = ({ id, children }) => {
  const { setTriggerRefresh } = useContext(CaredForContext)
  const [modal, setModal] = useState<AssociationModal>({
    isOpen: false,
  })

  const [contacts, setContacts] = useState()

  const [initialValues, setInitialValues] = useState<CaredForData>({
    medications: [],
    allergies: [],
    napTimes: [],
    feedingTimes: [],
    activities: [],
  })

  const closeModal = () => {
    setModal((previous) => ({
      content: previous.content,
      isOpen: false,
    }))
  }

  const openModal = (props: { content: Content; itemIndex?: number }) => {
    setModal({
      isOpen: true,
      content: props.content,
      itemIndex: props.itemIndex,
    })
  }

  const isEditing = id != null

  const onSubmit = async (values: CaredForData) => {
    const formattedValues = formatCaredForFormToApi(values)

    const submitAction = (values: CaredForData) =>
      isEditing ? updateCaredFor(id, values) : createCaredFor(values)

    const { data } = await submitAction(formattedValues)

    if (data.success) {
      Alert.alert('Registration complete')
      setTriggerRefresh(true)
    }
  }

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    validateForm,
    errors,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: onSubmit,
    enableReinitialize: true,
    validationSchema: caredForSchema,
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
  })

  useEffect(() => {
    const fetchCaredForData = async () => {
      const { data } = await showCaredFor(id)

      if (data.success) {
        setInitialValues(data.caree)
      }
    }

    if (id != null) fetchCaredForData()
  }, [id])

  const fetchContacts = async () => {
    const { data } = await listContacts()
    if (data.success) {
      const contactData = data?.contacts?.map((contact) => ({
        label: contact.contactName,
        value: contact.id,
        subLabel: contact.relationship,
      }))
      setContacts(contactData)
    } else {
      console.log('Error: /contacts')
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchContacts()
    }, [])
  )

  const handleRemove = () => {
    setFieldValue(modal.content, values[modal.content].slice(modal.itemIndex))
  }

  return (
    <CaredForFormContext.Provider
      value={{
        modal,
        openModal,
        closeModal,
        values,
        handleRemove,
        handleSubmit,
        validateForm,
        handleChange,
        setFieldValue,
        errors,
        isEditing,
        contacts,
      }}
    >
      {children}
    </CaredForFormContext.Provider>
  )
}
