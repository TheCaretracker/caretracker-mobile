import { FlatList, StyleSheet, View, Text } from 'react-native'
import { BackButtonHeader, Button } from '@/components'
import globalStyles from '@/globalStyles'
import { useCallback, useState } from 'react'
import ConfirmationModal from '@/components/Modals/ConfirmationModal'
import {
  acceptEmploymentInvite,
  deleteEmploymentLink,
  listEmploymentUsers,
} from '@/requests/employmentRequests'
import Avatar from '@/components/Avatar/Avatar'
import { SkeletonCard } from '@/components/Skeleton/SkeletonCard'
import InviteModal from './InviteModal'
import { useFocusEffect } from '@react-navigation/native'
import Colors from '@/utils/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const EmployersScreen = ({ navigation }: any) => {
  // Indicates if remote data is loaded
  const [isReady, setIsReady] = useState(false)
  const [modal, setModal] = useState<{ isOpen: boolean; id?: number }>({
    isOpen: false,
  })
  const [acceptModal, setAcceptModal] = useState<{
    isOpen: boolean
    id?: number
  }>({
    isOpen: false,
  })

  const [inviteModal, setInviteModal] = useState(false)
  const [employers, setEmployers] = useState([])
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>()

  const insets = useSafeAreaInsets()

  const forceRefresh = () => {
    setTriggerRefresh((previous) => !previous)
  }

  const fetchEmployers = async () => {
    setIsReady(false)
    const { data } = await listEmploymentUsers()

    if (data.success) {
      setEmployers(data.employments)
    }
    setIsReady(true)
  }

  useFocusEffect(
    useCallback(() => {
      fetchEmployers()
    }, [triggerRefresh])
  )

  const handleDelete = async (id) => {
    const { data } = await deleteEmploymentLink(id)
    if (data.success) {
      setEmployers(data.employments)
    }
  }

  const handleConfirm = async (type) => {
    const { data } = await acceptEmploymentInvite(
      acceptModal.id,
      type === 'accept'
    )
    if (data.success) {
      setAcceptModal({ isOpen: false, id: null })
      forceRefresh()
    }
  }

  const renderEmployer = ({ item }) => {
    const employer = item.employer
    const employeeStatus = item?.status

    return (
      <View style={styles.employerListWrapper}>
        <View style={styles.avatarNameWrapper}>
          <View style={{ width: 32, height: 32 }}>
            <Avatar source={employer.avatar} />
          </View>

          <Text
            style={[
              styles.employerName,
              globalStyles.bodyTextBold,
              // longNameStyle(employer.fullName.length),
            ]}
          >
            {employer.fullName}
          </Text>
        </View>

        {employeeStatus === 'pending' ? (
          <Text
            style={[styles.remove, globalStyles.bodyTextRegular]}
            onPress={() => setAcceptModal({ isOpen: true, id: item.id })}
          >
            Pending
          </Text>
        ) : (
          <Text
            style={[styles.remove, globalStyles.bodyTextRegular]}
            onPress={() => setModal({ isOpen: true, id: item.id })}
          >
            Remove
          </Text>
        )}
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View>
        <BackButtonHeader header="My Employers" navigation={navigation} />
        <View style={styles.wrapper}>
          {isReady ? (
            <FlatList
              style={{ width: '100%', flexGrow: 0 }}
              data={employers}
              renderItem={renderEmployer}
            />
          ) : (
            // Showing skeleton loaders initially
            <FlatList
              style={{ width: '100%' }}
              data={Array.from({ length: 8 })}
              renderItem={() => <SkeletonCard />}
            />
          )}
        </View>
      </View>
      <View style={{ flexGrow: 1 }} />
      <Button
        text="Add Employer"
        buttonStyle={[styles.inviteButton]}
        textStyle={styles.inviteButtonText}
        onPress={() => setInviteModal(true)}
      />
      <ConfirmationModal
        isModalVisible={modal.isOpen}
        setIsModalVisible={(isOpen) => setModal({ isOpen })}
        title="Remove Employer?"
        description="By removing this employer, you will no longer be able to receive
          schedule invites from them."
        primaryButtonText="Remove"
        onConfirm={() => handleDelete(modal.id)}
      />
      <ConfirmationModal
        isModalVisible={acceptModal.isOpen}
        setIsModalVisible={(isOpen) => setAcceptModal({ isOpen })}
        primaryButtonStyle={{ backgroundColor: Colors.PrimaryPurple }}
        primaryButtonText={'Accept'}
        secondaryButtonText="Decline"
        title="Accept/Decline Invite?"
        description="By accepting or declining this invite, your Employer will be notified."
        onConfirm={() => handleConfirm('accept')}
        onCancel={() => handleConfirm('decline')}
        closeOnConfirm={false}
      />
      <InviteModal
        isVisible={inviteModal}
        setModalVisible={setInviteModal}
        onSuccess={forceRefresh}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  employerListWrapper: {
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
  employerName: {
    fontSize: 16,
    color: '#375064',
    width: '70%',
  },
  remove: {
    fontSize: 12,
    color: '#6D767C',
    textDecorationLine: 'underline',
  },
  inviteButton: {
    backgroundColor: '#DED2FF',
    color: '#4440D6',
    marginHorizontal: 24,
  },
  inviteButtonText: {
    color: '#4440D6',
  },
  modal: { gap: 8, paddingHorizontal: 8 },
  modalTitle: { fontSize: 24, color: '#2e2e2e' },
})

export default EmployersScreen
