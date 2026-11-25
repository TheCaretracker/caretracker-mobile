import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native'
import { BackButtonHeader, Button } from '@/components'
import globalStyles from '@/globalStyles'
import { useCallback, useState } from 'react'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import { MenuVertical, USIcon, TrashIcon } from '@/assets/icons/icon'
import Colors from '@/utils/colors'
import { showEmployee } from '@/requests/employeeRequests'
import { EmployeeDetails } from '@/types/employee'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import Avatar from '@/components/Avatar/Avatar'
import SkeletonLabelValue from '@/components/Skeleton/SkeletonLabelValue'
import SkeletonLoader from '@/components/Skeleton/SkeletonLoader'
import RecurringEventCard from '@/components/RecurringEventCard/RecurringEventCard'
import { useFocusEffect } from '@react-navigation/native'
import { deleteEmploymentLink } from '@/requests/employmentRequests'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const DeviceHeight = Dimensions.get('window').height
const SmallDevice = Dimensions.get('window').height <= 667

const EmployeeDetailsScreen = ({ route, navigation }: any) => {
  const { id } = route.params
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [employee, setEmployee] = useState<EmployeeDetails>()

  const insets = useSafeAreaInsets()

  const fetchEmployeeData = async () => {
    const { data } = await showEmployee(id)
    if (data.success) {
      setEmployee(data.employee)
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchEmployeeData()
    }, [id])
  )

  const handleRemove = async () => {
    const { data } = await deleteEmploymentLink(employee.employmentLink)
    // React Navigation 7: `pop: true` goes back to the existing MyEmployees
    // screen (v6 behaviour) instead of pushing a new one.
    data?.success &&
      navigation.navigate('MyEmployees', undefined, { pop: true })
  }

  const renderSkeleton = () => (
    <View style={styles.wrapper}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarNameWrapper}>
          <Skeleton width={32} height={32} variant="circle" />
          <Skeleton width={200} height={22} />
        </View>
      </View>
      <SkeletonLabelValue />
      <SkeletonLabelValue />
      <Text style={[styles.schedulesText, globalStyles.bodyTextBold]}>
        Schedules
      </Text>
      <FlatList
        style={styles.flatlistStyle}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        data={Array(3)}
        renderItem={() => <Skeleton width={'100%'} height={80} />}
      />
    </View>
  )

  const isScheduleButtonDisabled = employee?.employmentLinkStatus === 'pending'

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <BackButtonHeader header="Employee Details" navigation={navigation} />
      <SkeletonLoader
        renderSkeleton={renderSkeleton}
        isReady={employee}
        renderContent={() => (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.wrapper}>
              <View>
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarNameWrapper}>
                    <View style={styles.avatarStyle}>
                      <Avatar source={employee.avatar} />
                    </View>
                    <Text
                      style={[
                        styles.employeeName,
                        globalStyles.bodyTextBold,
                        { flexShrink: 1 },
                      ]}
                    >
                      {employee.fullName}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                    <MenuVertical />
                  </TouchableOpacity>
                </View>
                {showMenu && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(true)
                      setShowMenu(!showMenu)
                    }}
                  >
                    <View style={styles.menu}>
                      <Text style={styles.infoText}>Delete</Text>
                      <TrashIcon />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.infoText}>{employee.email}</Text>
              </View>
              <View>
                <Text style={styles.label}>Phone number</Text>
                <View style={styles.avatarNameWrapper}>
                  <USIcon />
                  <Text style={styles.infoText}>{employee.phoneNumber}</Text>
                </View>
              </View>

              <View style={styles.divider} />
              <Text style={[styles.schedulesText, globalStyles.bodyTextBold]}>
                Schedules
              </Text>
              <View>
                {employee.recurringEvents.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      navigation.navigate('AddEditSchedule', {
                        id: item.id,
                        employee: employee,
                      })
                    }
                  >
                    <RecurringEventCard data={item} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      />
      <ConfirmationModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        title="Remove Employee?"
        description="By removing this employee, you will no longer be able to request a schedule, unless you invite them again."
        primaryButtonText="Remove"
        onConfirm={handleRemove}
      />
      <View style={{ flexGrow: 1 }} />
      <Button
        text="Submit schedule request"
        buttonStyle={styles.buttonStyle}
        onPress={() =>
          navigation.navigate('AddEditSchedule', {
            employee: employee,
          })
        }
        disabled={isScheduleButtonDisabled}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
  },
  wrapper: {
    paddingTop: 8,
    paddingHorizontal: 24,
    rowGap: 24,
    paddingBottom: 100,
  },
  flatlistStyle: {
    width: '100%',
    maxHeight: SmallDevice ? DeviceHeight * 0.38 : DeviceHeight * 0.52,
  },
  contactListWrapper: {
    backgroundColor: 'white',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    rowGap: 4,
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  avatarNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarStyle: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  employeeName: {
    fontSize: 16,
    color: Colors.DarkBlue,
  },
  schedulesText: {
    fontSize: 18,
    color: Colors.DarkBlue,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrey,
  },
  label: {
    fontFamily: 'Outfit-Regular',
    color: Colors.PrimaryBlue,
    fontSize: 10,
  },
  infoText: {
    fontFamily: 'Outfit-Regular',
    color: Colors.BlackText,
    fontSize: 14,
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Outfit-Regular',
    color: Colors.DarkBlue,
    fontSize: 14,
  },
  repeatText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkBlue,
  },
  pendingText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkGrey,
  },
  buttonStyle: {
    width: '88%',
    alignSelf: 'center',
  },
})

export default EmployeeDetailsScreen
