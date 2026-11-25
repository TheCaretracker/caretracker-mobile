import { StyleSheet, View, Dimensions, ScrollView, Alert } from 'react-native'
import { BackButtonHeader, Button, InputField } from '@/components'
import { useFormik } from 'formik'
import { USIcon } from '@/assets/icons/icon'
import { useEffect, useState } from 'react'
import {
  ContactData,
  showContact,
  createContact,
  updateContact,
} from '@/requests/contactRequests'
import { formatCaredForFormToApi } from '@/contexts/CaredForForm/helper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AddContactScreen = ({ route, navigation }: any) => {
  const screenWidth = Dimensions.get('window').width
  const insets = useSafeAreaInsets()
  const { itemId, isEdit } = route.params ?? {
    itemId: null,
    isEdit: false,
  }
  const [initialData, setInitialData] = useState<ContactData>({
    contactName: '',
    relationship: '',
    email: '',
    phoneNumber: '',
  })

  // Fetch selected contact details
  useEffect(() => {
    const fetchContactDetails = async () => {
      const { data } = await showContact(itemId)
      if (data.success) {
        setInitialData(data.contact)
      } else {
        Alert.alert('Error: Could not get contact details!')
      }
    }

    // If in isEditing mode fetch fresh contact details first
    if (isEdit) {
      fetchContactDetails()
    }
  }, [itemId])

  const addOrEditChanges = async (values: any) => {
    values.id = isEdit ? itemId : null
    const formattedValues = formatCaredForFormToApi(values)
    console.log('API FORMATTED DATA', formattedValues)

    const { data } = isEdit
      ? await updateContact(formattedValues)
      : await createContact(formattedValues)

    if (data.success) {
      Alert.alert('Contact saved!')
    } else {
      Alert.alert('Oops! Unable to save.')
    }
    navigation.goBack()
  }

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialData,
    onSubmit: (values) => addOrEditChanges(values),
    enableReinitialize: true,
  })
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <BackButtonHeader
        header={isEdit ? 'Edit Contact' : 'Add Contact'}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.wrapper}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              gap: 22,
              alignItems: 'center',
              width: screenWidth * 0.88,
            }}
          >
            <InputField
              placeholder="Full name"
              inputType="text"
              value={values.contactName}
              onChangeText={handleChange('contactName')}
            />
            <InputField
              placeholder="Relationship"
              inputType="text"
              value={values.relationship}
              onChangeText={handleChange('relationship')}
            />
            <InputField
              placeholder="Email (optional)"
              inputType="email"
              value={values.email}
              onChangeText={handleChange('email')}
            />
            <InputField
              placeholder="Phone number"
              inputType="text"
              value={values.phoneNumber}
              keyboardType="phone-pad"
              onChangeText={handleChange('phoneNumber')}
              leftIcon={USIcon}
              textContentType="telephoneNumber"
            />
          </View>
          <View
            style={{
              width: screenWidth * 0.88,
            }}
          >
            <Button
              text={isEdit ? 'Save changes ' : 'Save'}
              type="primary"
              onPress={() => {
                handleSubmit()
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 24,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  wrapper: {
    flexGrow: 1,
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  imageOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  editText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 4,
  },
})

export default AddContactScreen
