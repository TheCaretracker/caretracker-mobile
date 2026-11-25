import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native'
import { BackButtonHeader } from '@/components'
import {
  MenuVertical,
  MedicationIcon,
  ActivitiesIcon,
  AllergyIcon,
  FeedingIcon,
  NapIcon,
  TrashIcon,
  EditIcon,
} from '@/assets/icons/icon'
import CaredForDetailCard from '@/components/Card/CaredForDetailCard'
import { useState, useContext, useCallback } from 'react'
import { deleteCaredFor, showCaredFor } from '@/requests/caredForRequests'
import CaredForAvatar from '@/components/CaredFor/CaredForAvatar'
import { UserDataContext } from '@/contexts/UserDataContext'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import Toast from 'react-native-toast-message'
import ToastNotification from '@/components/Toast/ToastNotification'
import { navigate } from '@/helpers/RootNavigation'
import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment'

const CaredForDetail = ({ route, navigation }) => {
  // Indicates if remote data is loaded
  const [isReady, setIsReady] = useState(false)

  const { childId } = route.params
  const [caredFor, setCaredFor] = useState(null)
  const isEmployer = useContext(UserDataContext).getRole() === 'employer'
  const [showMenu, setShowMenu] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalId, setModalId] = useState({ content: '', itemIndex: null })

  const openModal = ({ content, itemIndex }: any) => {
    setIsOpenModal(true)
    setModalId({ content, itemIndex })
  }

  const fetchCaredForData = async () => {
    setIsReady(false)

    const { data } = await showCaredFor(childId)
    if (data.success) {
      setCaredFor(data.caree)
    }
    setIsReady(true)
  }

  useFocusEffect(
    useCallback(() => {
      fetchCaredForData()
    }, [childId])
  )

  const getAge = () => {
    const birthDate = moment(caredFor?.birthday)
    const currentDate = moment()

    const monthsDifference = currentDate.diff(birthDate, 'months')
    const daysDifference = currentDate.diff(birthDate, 'days')

    if (
      monthsDifference === 0 ||
      (monthsDifference === 1 && currentDate.date() < birthDate.date())
    ) {
      return `${daysDifference} day${daysDifference > 1 ? 's' : ''}`
    } else if (currentDate.diff(birthDate, 'years') === 0) {
      return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''}`
    } else {
      const yearsDifference = currentDate.diff(birthDate, 'years')
      return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''}`
    }
  }

  // Method that renders skeleton loader before remote data is available
  const renderSkeleton = () => (
    <View style={styles.cardBody}>
      <View style={styles.userInfo}>
        <View style={styles.imageContainer}>
          <Skeleton variant={'circle'} width={80} height={80} />
        </View>
        <Skeleton width={'60%'} height={30} />
        <Skeleton width={'50%'} height={20} />
      </View>
      <FlatList
        style={{
          width: '100%',
          paddingHorizontal: 20,
        }}
        data={Array.from({ length: 2 })}
        renderItem={() => (
          <View style={{ gap: 6, margin: 10 }}>
            <Skeleton width={'50%'} height={30} />
            <Skeleton width={'100%'} height={190} />
          </View>
        )}
      />
    </View>
  )

  const handleDelete = async () => {
    const { data } = await deleteCaredFor(caredFor.id)
    if (data.success) {
      Toast.show({ type: 'error', text1: 'Person removed!' })
      setTimeout(() => navigation.goBack(), 1000)
    }
  }
  if (!caredFor || !isReady)
    return (
      <View style={styles.container}>
        <BackButtonHeader header="Details" navigation={navigation} />
        {renderSkeleton()}
      </View>
    )

  return (
    <View style={styles.container}>
      <BackButtonHeader header="Details" navigation={navigation} />
      <ScrollView>
        <View style={styles.cardBody}>
          <View style={styles.userInfo}>
            {isEmployer && (
              <>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setShowMenu(!showMenu)}
                >
                  <MenuVertical />
                </TouchableOpacity>
                {showMenu && (
                  <View style={styles.menuWrapper}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        navigate('NewCaredFor', { id: caredFor.id })
                        setShowMenu(!showMenu)
                      }}
                    >
                      <Text style={styles.menuText}>Edit</Text>
                      <EditIcon />
                    </TouchableOpacity>
                    <View style={styles.hasBorder} />
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setShowMenu(false)
                        setShowDeleteModal(true)
                      }}
                    >
                      <Text style={styles.menuText}>Delete</Text>
                      <TrashIcon />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            <View style={styles.imageContainer}>
              <CaredForAvatar avatar={caredFor.avatar} />
            </View>
            <View style={styles.basicInfo}>
              <Text style={[styles.bodyTextBold, styles.bodyTextLarger]}>
                {caredFor.fullName}
              </Text>
              <Text style={[styles.bodyTextBold, styles.bodyTextMedium]}>
                {getAge()}
              </Text>
              <Text
                style={[
                  styles.bodyTextRegular,
                  styles.bodyTextSmall,
                  styles.textGrey,
                ]}
              >
                Added By {caredFor.guardianName}
              </Text>
            </View>
          </View>

          <CaredForDetailCard
            items={caredFor.medications}
            title="Medication"
            icon={<MedicationIcon width={24} height={24} />}
            hasSeperator
          />
          <CaredForDetailCard
            items={caredFor.allergies}
            title="Allergies"
            icon={<AllergyIcon width={24} height={24} />}
            hasSeperator
            type="threeColumn"
          />
          <CaredForDetailCard
            items={caredFor.feedingTimes}
            title="Feeding time"
            icon={<FeedingIcon width={24} height={24} />}
            hasSeperator
            type="twoColumn"
          />
          <CaredForDetailCard
            items={caredFor.napTimes}
            title="Nap time"
            icon={<NapIcon width={24} height={24} />}
            hasSeperator
            type="threeColumn"
          />
          <CaredForDetailCard
            items={caredFor.activities}
            title="Activities"
            icon={<ActivitiesIcon width={24} height={24} />}
            hasSeperator
          />
          <View />
        </View>
      </ScrollView>
      <ToastNotification
        position="bottom"
        bottomOffset={showDeleteModal ? 12 : 82}
      />
      <ConfirmationModal
        isModalVisible={showDeleteModal}
        setIsModalVisible={setShowDeleteModal}
        title="Remove Person?"
        description="By removing this person, you will loose all their data. This action cannot be undone."
        primaryButtonText="Remove"
        closeOnConfirm
        onConfirm={handleDelete}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'column',
    gap: 24,
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  basicInfo: { flexDirection: 'column', alignItems: 'center', gap: 2 },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bodyTextBold: {
    fontFamily: 'Outfit-SemiBold',
  },
  bodyTextRegular: {
    fontFamily: 'Outfit-Regular',
  },
  bodyTextLarger: { fontSize: 24 },
  bodyTextLarge: { fontSize: 18 },
  bodyTextMedium: {
    fontSize: 14,
  },
  bodyTextSmall: {
    fontSize: 12,
  },
  textGrey: {
    color: '#6D767C',
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  menuButton: {
    position: 'absolute',
    right: 24,
  },
  menuWrapper: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'white',
    minHeight: 90,
    minWidth: 120,
    borderRadius: 12,
    zIndex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
  },
  hasBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  wrapper: {
    width: '88%',
    alignSelf: 'center',
    rowGap: 16,
  },
  buttonSave: {
    width: '88%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  editAvatarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  editText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 4,
  },
  linearGradientStyle: {
    width: 80,
    height: 80,
    borderRadius: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})

export default CaredForDetail
