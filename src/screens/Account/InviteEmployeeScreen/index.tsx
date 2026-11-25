import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native'
import { BackButtonHeader, Button, InputField } from '@/components'
import { useEffect, useState } from 'react'
import DefaultModal from '@/components/Modals/DefaultModal'
import Colors from '@/utils/colors'
import { PlusIcon, SearchIcon, USIcon } from '@/assets/icons/icon'
import { newEmployeeSchema } from './schema'
import { useFormik } from 'formik'
import { createInvite } from '@/requests/inviteRequests'
import { LinkingContext } from '@/contexts/LinkingContext'
import { shareInvite } from './share'
import { User } from '@/types/user'
import { inviteEmployee, searchEmployee } from '@/requests/employeeRequests'
import Avatar from '@/components/Avatar/Avatar'
import { string } from 'yup'
import { createEmploymentLink } from '@/requests/employmentRequests'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const smallDevice = Dimensions.get('window').height <= 667

interface InviteEmployeeForm {
  fullName?: string
  email?: string
  phoneNumber?: string
}

const InviteEmployeeScreen = ({ navigation }: any) => {
  const onSubmitNewEmployee = async () => {
    if (invite) {
      await shareInvite(invite, () => setIsModalVisible(true))
      return
    }
    const { data } = await createInvite(values)

    if (data.success) {
      setInvite(data.invite)
      await shareInvite(data.invite, () => setIsModalVisible(true))
    }
  }

  const handleSetModal = (isOpen: boolean) => {
    setIsModalVisible(isOpen)
    if (!isOpen) {
      navigation.goBack()
    }
  }

  const handleSendInvite = async () => {
    const { data } = await inviteEmployee(selectedOption.id)

    if (data.success) {
      setIsModalVisible(true)
    }
  }

  const {
    values,
    handleChange,
    handleSubmit: handleNewInvite,
    errors,
    isValid: isFormValid,
    touched,
    handleBlur,
  } = useFormik<InviteEmployeeForm>({
    initialValues: {},
    validationSchema: newEmployeeSchema,
    onSubmit: onSubmitNewEmployee,
    validateOnMount: true,
    validateOnBlur: true,
  })

  const [selectedOption, setSelectedOption] = useState<null | User>(null)
  const isSubmitDisabled = selectedOption ? false : isFormValid ? false : true

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [onFocus, setOnFocus] = useState(false)
  const [newInvitation, setNewInvitation] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<User[]>([])
  const [invite, setInvite] = useState<any>()

  const insets = useSafeAreaInsets()

  const search = async () => {
    const { data } = await searchEmployee(searchTerm)
    if (data.success) {
      setFilteredOptions(data.employees)
    }
  }

  useEffect(() => {
    search()
  }, [searchTerm])

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
        setShowOptions(false)
        setOnFocus(false)
      }}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <BackButtonHeader header="Invite Employee" navigation={navigation} />
        <KeyboardAwareScrollView
          style={styles.wrapper}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.text, styles.regular, { textAlign: 'center' }]}>
            Invite your Employees to use the CareTracker app and easily manage
            your work.
          </Text>
          <View style={{ marginVertical: 24 }}>
            <View style={[styles.searchField, onFocus && styles.onFocus]}>
              <SearchIcon />
              <TextInput
                placeholder="Search by name"
                placeholderTextColor={Colors.DarkGrey}
                style={styles.searchInput}
                value={searchTerm}
                onPressIn={() => setShowOptions(true)}
                onFocus={() => setOnFocus(true)}
                onChangeText={setSearchTerm}
              />
            </View>
            {showOptions ? (
              <View style={styles.dropdownContainer}>
                <ScrollView>
                  {filteredOptions.map((item) => (
                    <TouchableOpacity
                      key={item.fullName}
                      style={styles.itemOption}
                      onPress={() => {
                        setSelectedOption(item)
                        setShowOptions(false)
                        setOnFocus(false)
                        setSearchTerm('')
                      }}
                    >
                      <View style={styles.avatarStyle}>
                        <Avatar source={item.avatar} />
                      </View>
                      <Text style={styles.text}>{item.fullName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.addNewButton}
                  onPress={() => {
                    setNewInvitation(true)
                    setShowOptions(false)
                    setOnFocus(false)
                    setSelectedOption(null)
                    Keyboard.dismiss()
                  }}
                >
                  <PlusIcon />
                  <Text
                    style={[
                      styles.text,
                      styles.regular,
                      styles.semiBold,
                      { color: Colors.PrimaryPurple },
                    ]}
                  >
                    Invite new Employee
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {selectedOption ? (
            <View style={{ rowGap: 16 }}>
              <View style={styles.itemOption}>
                <View style={styles.avatarStyle}>
                  <Avatar source={selectedOption.avatar} />
                </View>
                <Text style={styles.text}>{selectedOption.fullName}</Text>
              </View>
              <View>
                <Text style={styles.smallLabel}>Email</Text>
                <Text style={styles.text}>{selectedOption.email}</Text>
              </View>
              <View>
                <Text style={[styles.smallLabel, { marginBottom: 2 }]}>
                  Phone
                </Text>
                <View style={styles.itemOption}>
                  <USIcon />
                  <Text style={styles.text}>{selectedOption.phoneNumber}</Text>
                </View>
              </View>
            </View>
          ) : null}

          {!selectedOption && newInvitation ? (
            <View style={{ rowGap: 16 }}>
              <Text
                style={[
                  styles.modalTitle,
                  styles.regular,
                  { color: Colors.DarkBlue },
                ]}
              >
                Invite new Employee
              </Text>
              <InputField
                placeholder="Full name"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                error={touched.fullName ? errors.fullName : null}
                onBlur={handleBlur('fullName')}
              />
              <InputField
                placeholder="Email"
                inputType="email"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                error={touched.email && errors.email}
                onBlur={handleBlur('email')}
              />
              <InputField
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                leftIcon={USIcon}
                error={touched.phoneNumber && errors.phoneNumber}
                onBlur={handleBlur('phoneNumber')}
                textContentType="telephoneNumber"
              />
            </View>
          ) : null}
          <View style={{ flexGrow: 1 }} />
          <View style={styles.buttonStyle}>
            <Button
              text="Send invite"
              onPress={() => {
                newInvitation ? handleNewInvite() : handleSendInvite()
              }}
              disabled={isSubmitDisabled}
            />
          </View>
        </KeyboardAwareScrollView>

        <DefaultModal
          isVisible={isModalVisible}
          setModalVisible={handleSetModal}
          modalstyle={styles.modalContainer}
        >
          <View style={styles.textWrapper}>
            <Text style={styles.modalTitle}>Invite sent</Text>
            <Text style={styles.text}>
              This user have been invited to join The CareTracker app. In case
              of acceptance, they will be automatically added to your employee's
              list.
            </Text>
          </View>
          <Button
            type="secondary"
            text="Close"
            onPress={() => {
              handleSetModal(false)
            }}
          />
        </DefaultModal>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
  },
  wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    rowGap: 24,
    flex: 1,
  },
  text: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.DarkBlue,
  },
  regular: {
    fontSize: 16,
  },
  semiBold: {
    fontFamily: 'Outfit-SemiBold',
  },
  searchField: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    borderRadius: 100,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    columnGap: 8,
  },
  onFocus: {
    borderColor: Colors.PrimaryBlue,
  },
  searchInput: {
    width: '90%',
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.BlackText,
  },
  buttonStyle: {
    width: '100%',
    alignSelf: 'center',
  },
  modalContainer: {
    width: '95%',
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 24,
  },
  textWrapper: {
    rowGap: 8,
    marginBottom: 32,
    marginTop: -8,
  },
  modalTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: Colors.BlackText,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.PrimaryBlue,
    marginTop: 4,
    maxHeight: smallDevice ? 174 : 212,
  },
  itemOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginBottom: 8,
  },
  avatarStyle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  addNewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.LightGrey,
  },
  smallLabel: {
    fontSize: 10,
    color: Colors.PrimaryBlue,
  },
  contentContainer: {
    flexGrow: 1,
  },
})

export default InviteEmployeeScreen
