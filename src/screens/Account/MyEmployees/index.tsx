import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { BackButtonHeader, Button } from '@/components'
import { EmployeesData } from './employees'
import globalStyles from '@/globalStyles'
import { useCallback, useEffect, useState } from 'react'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import { listEmploymentUsers } from '@/requests/employmentRequests'
import Avatar from '@/components/Avatar/Avatar'
import { SkeletonCard } from '@/components/Skeleton/SkeletonCard'
import { useFocusEffect } from '@react-navigation/native'
import { listInvites } from '@/requests/inviteRequests'
import Colors from '@/utils/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const EmployeesScreen = ({ navigation }: any) => {
  // Indicates if remote data is loaded
  const [isReady, setIsReady] = useState(false)
  const [employees, setEmployees] = useState([])
  const [invites, setInvites] = useState([])

  const insets = useSafeAreaInsets()

  const fetchEmployees = async () => {
    setIsReady(false)
    const { data: employeeData } = await listEmploymentUsers()

    setEmployees(employeeData.employments)

    setIsReady(true)
  }

  const fetchInvites = async () => {
    const { data: inviteData } = await listInvites()
    if (inviteData.success) {
      setInvites(inviteData.invites)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchEmployees()
      fetchInvites()
    }, [])
  )

  const handleEmployeeNavigation = (item) => {
    navigation.navigate('EmployeeDetails', {
      id: item.employee.id,
    })
  }

  const handleInviteNavigation = (item) => {
    navigation.navigate('InviteDetails', {
      id: item.id,
    })
  }

  const renderDataCard = (data) => (
    <View style={styles.employeeListWrapper}>
      <View style={styles.avatarNameWrapper}>
        <View style={{ height: 32, width: 32 }}>
          <Avatar source={data.avatar} />
        </View>
        <View style={styles.dataContainer}>
          <Text style={[styles.employeeName, globalStyles.bodyTextBold]}>
            {data.fullName}
          </Text>
          {data.status === 'pending' && (
            <Text style={[styles.pendingLabel, globalStyles.bodyTextRegular]}>
              Pending
            </Text>
          )}
        </View>
      </View>
      <ArrowRightIcon />
    </View>
  )

  const renderInvite = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleInviteNavigation(item)}
    >
      {renderDataCard(item)}
    </TouchableOpacity>
  )

  const renderEmployee = (item) => {
    const employee = item.employee
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleEmployeeNavigation(item)}
      >
        {renderDataCard({ ...employee, status: item.status })}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <BackButtonHeader header="My Employees" navigation={navigation} />
      {isReady ? (
        <ScrollView
          style={{ width: '100%', flex: 1 }}
          contentContainerStyle={styles.wrapper}
        >
          {employees.map((employee) => renderEmployee(employee))}
          {Boolean(invites.length) && (
            <>
              <Text style={[globalStyles.h2, styles.inviteHeader]}>
                Invites
              </Text>
              {invites.map((invite) => renderInvite(invite))}
            </>
          )}
        </ScrollView>
      ) : (
        <FlatList
          style={{ width: '100%' }}
          data={Array.from({ length: 8 })}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.wrapper}
        />
      )}
      <View style={{ flexGrow: 1 }} />
      <Button
        text="Invite Employee"
        buttonStyle={[styles.inviteButton]}
        textStyle={styles.inviteButtonText}
        onPress={() => navigation.navigate('InviteEmployee')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inviteHeader: {
    marginTop: 25,
    marginBottom: 12,
    color: Colors.DarkBlue,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    flexGrow: 0,
  },
  employeeListWrapper: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEBEC',
  },
  avatarNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  employeeName: {
    fontSize: 16,
    color: '#375064',
    width: '82%',
    flex: 3,
    lineHeight: 17,
  },
  inviteButton: {
    backgroundColor: '#DED2FF',
    color: '#4440D6',
    marginHorizontal: 24,
  },
  inviteButtonText: {
    color: '#4440D6',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  pendingLabel: {
    flex: 1,
    flexGrow: 1,
    color: Colors.Grey,
    marginLeft: 10,
  },
})

export default EmployeesScreen
