import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Platform,
} from 'react-native'
import {
  BackButtonHeader,
  Button,
  Card,
  CustomSelect,
  InputField,
} from '@/components'
import { useFormik } from 'formik'
import { USStates } from '@/utils/USStates'
import { USIcon } from '@/assets/icons/icon'
import { useContext, useState } from 'react'
import UploadPicture from '@/components/Avatar/UploadPicture'
import ProfilePictureModal from '@/components/Modals/ProfilePictureModal'
import { deleteUser, updateUser } from '@/requests/userRequests'
import { formatUserDataToAPI } from '@/helpers/usersHelper'
import { Role, UserDataContext } from '@/contexts/UserDataContext'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const smallDevice = screenHeight <= 667

const SubscriptionInfo = ({ planPrice, validDate }) => (
  <View style={styles.subscriptionWrapper}>
    <Text style={styles.subscriptionText}>Subscription: {planPrice}</Text>
    <Text style={styles.validText}>Valid from: {validDate}</Text>
    <Text style={styles.manageText}>
      To manage your subscription, please go to your application store.
    </Text>
  </View>
)

const AccountSettingsScreen = ({ navigation }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  // Indicates if remote data is loaded
  const [isReady, setIsReady] = useState(false)

  const insets = useSafeAreaInsets()

  const saveProfileChanges = async (values: any) => {
    const formattedValues = formatUserDataToAPI(values)
    const { data } = await updateUser(formattedValues)
    if (data.success) {
      Alert.alert('User data updated successfully')
    }
    await refetchUserData()
  }

  const { userData, refetchUserData, getRole, deleteUserData } =
    useContext(UserDataContext)

  const currentRole: Role = getRole()
  const isEmployer = currentRole === Role.Employer

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: userData,
    onSubmit: (values) => saveProfileChanges(values),
    enableReinitialize: true,
  })

  const handleDelete = async () => {
    const { data } = await deleteUser()
    if (data.success) {
      console.log('DELETE SUCCESS')
      deleteUserData()
    } else {
      const error = data.errors[0]
      Alert.alert('Error!', error)
    }
  }

  const subscriptionValues = {
    planPrice: '$4.99/month',
    validDate: '3 August, 2023',
  }

  return (
    <View style={styles.container}>
      <BackButtonHeader header="Account Settings" navigation={navigation} />
      <View>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <UploadPicture
              handleProfilePictureEdit={() => setIsModalVisible(true)}
              avatar={values.avatar}
            />
          </View>
          <View style={styles.contentWrapper}>
            <InputField
              placeholder="Full name"
              inputType="text"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
            />
            <InputField
              placeholder="Phone number"
              inputType="text"
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              leftIcon={USIcon}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
            <InputField
              placeholder="Email"
              inputType="email"
              value={values.email}
              onChangeText={handleChange('email')}
            />
            <InputField
              placeholder="City"
              inputType="text"
              value={values.address.city}
              onChangeText={handleChange('address.city')}
            />
            <CustomSelect
              options={USStates}
              selectedValue={values.address.state}
              onSelect={handleChange('address.state')}
              label="State"
            />
            <Card
              type="iconRight"
              children="Delete Account"
              onPress={() => {
                setIsDeleteModalVisible(true)
              }}
              styleProps={{ color: '#FD5252' }}
            />
          </View>
          {/* Dummy View for KeyboardAwareScrollView to work */}
          <View style={{ height: smallDevice ? 300 : 200 }} />
        </KeyboardAwareScrollView>
      </View>
      {/* Bottom wrapper */}
      <View
        style={[
          styles.bottomWrapper,
          {
            bottom: Platform.select({
              ios: insets.bottom,
              android: insets.bottom > 24 ? 12 : insets.bottom,
            }),
          },
        ]}
      >
        {/* Subscription View If user is Employer */}
        {isEmployer && (
          <SubscriptionInfo
            planPrice={subscriptionValues.planPrice}
            validDate={subscriptionValues.validDate}
          />
        )}
        <Button
          text="Save changes"
          type="primary"
          onPress={() => {
            navigation.goBack()
            handleSubmit()
          }}
        />
      </View>
      <ProfilePictureModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setProfilePicture={(value: { data: string; mime: string }) => {
          setFieldValue('avatar', value)
          setIsModalVisible(false)
        }}
      />
      <ConfirmationModal
        isModalVisible={isDeleteModalVisible}
        setIsModalVisible={setIsDeleteModalVisible}
        title="Delete Account?"
        description="Are you sure you want to delete this account?"
        primaryButtonText="Delete"
        onConfirm={handleDelete}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    alignItems: 'center',
    paddingBottom: 32,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 22,
  },
  wrapper: {
    gap: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  subscriptionText: {
    fontSize: 14,
    fontFamily: 'Outfit-SemiBold',
  },
  validText: {
    color: '#6D767C',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    height: 20,
  },
  manageText: {
    color: '#6D767C',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    padding: 0.1,
  },
  subscriptionWrapper: {
    gap: 4,
    paddingTop: 24,
    borderTopColor: '#EAEBEC',
    borderTopWidth: 1,
  },
  contentWrapper: {
    flexDirection: 'column',
    gap: 22,
    alignItems: 'center',
    width: screenWidth * 0.88,
    minHeight: screenHeight - 300,
  },
  bottomWrapper: {
    backgroundColor: '#f8f8f8',
    width: screenWidth * 0.88,
    position: 'absolute',
    gap: 20,
  },
})

export default AccountSettingsScreen
