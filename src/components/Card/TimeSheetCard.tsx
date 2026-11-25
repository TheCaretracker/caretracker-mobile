import {
  EditIcon,
  MenuVertical,
  TrashIcon,
  CancelIcon,
} from '@/assets/icons/icon'
import { UserDataContext } from '@/contexts/UserDataContext'
import Colors from '@/utils/colors'
import { useContext, useState } from 'react'
import {
  Alert,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import styled from 'styled-components/native'
import ConfirmationModal from '../Modals/ConfirmationModal'
import {
  acceptDeclineTimeRecordRequest,
  deleteEvent,
} from '@/requests/workEventsRequests'
import moment from 'moment'
import { navigate } from '@/helpers/RootNavigation'

const screenWidth = Dimensions.get('window').width

const NameText = styled.Text`
  font-family: 'Outfit-SemiBold';
  color: #375064;
  font-size: 16px;
  margin-bottom: 8px;
  flex: 1;
`
const LabelText = styled.Text`
  font-family: 'Outfit-Regular';
  color: #6d767c;
  font-size: 12px;
`
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  row-gap: 10px;
  column-gap: 15px;
`
const Column = styled.View`
  flex-shrink: 1;
`
const ColumnMiddle = styled(Column)``
const LastColumn = styled(Column)`
  align-items: flex-end;
  flex-grow: 1;
`
const CardContainer = styled.View`
  border-radius: 16px;
  background-color: white;
  min-height: 93px;
  width: ${screenWidth / 1.08};
  padding: 16px;
  border-width: 1px;
  border-style: solid;
  border-color: #eaebec;
`

const MenuButton = styled.TouchableOpacity`
  position: absolute;
  right: 12px;
  top: 16px;
`
const MenuWrapper = styled.View`
  position: absolute;
  top: 32px;
  right: 12px;
  background-color: #ffffff;
  min-width: 100px;
  border-radius: 12px;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  gap: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`
const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`
const MenuText = styled.Text`
  font-size: 14px;
  font-family: 'Outfit-Regular';
  color: ${(props) => props.color};
`
const PendingAcceptanceText = styled.Text`
  font-family: 'Outfit-Regular';
  font-size: 12px;
  color: #6d767c;
  margin-right: ${(props) => (props.status !== 'pending' ? '14px' : '0')};
  margin-top: 2px;
  text-decoration-line: ${(props) =>
    props.disablePendingStatus ? 'none' : 'underline'};
`

interface TimeSheetCardProps {
  event?: any
  eventId?: number | string
  name?: string
  clockIn?: string
  clockOut?: string
  totalTime?: string
  status?: string
  forceRefresh?: any
}

const TimeSheetCard = ({
  event,
  eventId,
  name,
  clockIn,
  clockOut,
  totalTime,
  status,
  forceRefresh,
}: TimeSheetCardProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [timeRecordModalOpen, setTimeRecordModalOpen] = useState(false)
  const { userData } = useContext(UserDataContext)
  const [timeRecordAcceptModal, setTimeRecordAcceptModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)

  const disablePendingStatus =
    (userData.type === 'Caregiver' &&
      event.requestedByCaregiver == userData.id) ||
    (userData.type === 'Guardian' && event.requestedByGuardian == userData.id)

  const handleConfirm = async (type) => {
    const { data } = await acceptDeclineTimeRecordRequest(event?.requestId, {
      accept: type === 'accept',
    })

    if (data.success) {
      setTimeRecordAcceptModal(false)
      forceRefresh()
    }
  }

  const handleDelete = async () => {
    const { data } = await deleteEvent(event?.id)

    if (data.success) {
      Alert.alert(
        'Success',
        `Delete request successfully sent to your ${userType}`,
        [
          {
            text: 'Confirm',
            onPress: () => setDeleteModal(false),
          },
        ]
      )
      forceRefresh()
    }
  }
  const userType = userData.type === 'Caregiver' ? 'Employer' : 'Employee'

  // TO Give more space between the date and the time
  const getClockInTime = moment(clockIn).format('MMM DD hh:mm A')
  const getClockOutTime = moment(clockOut).format('MMM DD hh:mm A')

  return (
    <CardContainer>
      <Row>
        <NameText numberOfLines={1}>{name}</NameText>
        {status === 'pending' && (
          <TouchableOpacity
            onPress={() => {
              setTimeRecordAcceptModal(true)
            }}
            disabled={disablePendingStatus}
            style={{ marginRight: 15 }}
          >
            <PendingAcceptanceText
              status={status}
              disablePendingStatus={disablePendingStatus}
            >
              {disablePendingStatus
                ? `Awaiting ${userType}'s Approval`
                : 'Pending Acceptance'}
            </PendingAcceptanceText>
          </TouchableOpacity>
        )}
      </Row>
      <Row>
        <Column>
          <LabelText>Clock-in</LabelText>
          <Text style={styles.TimeText}>{getClockInTime}</Text>
        </Column>
        <ColumnMiddle>
          <LabelText>Clock-out</LabelText>
          <Text style={styles.TimeText}>{getClockOutTime}</Text>
        </ColumnMiddle>
        <LastColumn>
          <LabelText>Total time</LabelText>
          <Text style={styles.TimeText}>{totalTime}</Text>
        </LastColumn>
      </Row>

      <MenuButton onPress={() => setShowMenu(!showMenu)}>
        <MenuVertical />
      </MenuButton>

      {showMenu && (
        <MenuWrapper>
          {status === 'pending' ? (
            <MenuItem
              onPress={() => {
                setCancelModal(true)
                setShowMenu(false)
              }}
            >
              <MenuText color={Colors.Red}>Cancel</MenuText>
              <CancelIcon color={Colors.Red} />
            </MenuItem>
          ) : (
            <>
              <MenuItem
                onPress={() => {
                  navigate('TimeSheetAddEdit', { id: eventId })
                }}
              >
                <MenuText>Edit</MenuText>
                <EditIcon />
              </MenuItem>
              <MenuItem
                onPress={() => {
                  setDeleteModal(true)
                }}
              >
                <MenuText color={Colors.Red}>Delete</MenuText>
                <TrashIcon color={Colors.Red} />
              </MenuItem>
            </>
          )}
        </MenuWrapper>
      )}

      <ConfirmationModal
        isModalVisible={timeRecordAcceptModal}
        setIsModalVisible={(isOpen) => setTimeRecordAcceptModal(isOpen)}
        primaryButtonStyle={{ backgroundColor: Colors.PrimaryPurple }}
        primaryButtonText={'Accept'}
        secondaryButtonText="Decline"
        title="Accept/Decline Time Record?"
        description={`By accepting or declining this time record, your ${userType} will be notified.`}
        onConfirm={() => handleConfirm('accept')}
        onCancel={() => handleConfirm('decline')}
        closeOnConfirm={false}
      />
      <ConfirmationModal
        isModalVisible={deleteModal}
        setIsModalVisible={setDeleteModal}
        primaryButtonStyle={{ backgroundColor: Colors.Red }}
        primaryButtonText="Delete"
        title="Request record delete"
        description={`Are you sure you want to delete this timesheet record? Your request will first be reviewed by your ${userType}`}
        closeOnConfirm={false}
        onConfirm={() => handleDelete()}
      />
      <ConfirmationModal
        isModalVisible={cancelModal}
        setIsModalVisible={setCancelModal}
        primaryButtonStyle={{ backgroundColor: Colors.Red }}
        primaryButtonText="Cancel Request"
        secondaryButtonText="Not Now"
        title="Cancel change request"
        description={`Are you sure you want to cancel this request?`}
        closeOnConfirm
        onConfirm={() => handleConfirm('decline')}
      />
    </CardContainer>
  )
}

const styles = StyleSheet.create({
  TimeText: {
    fontFamily: 'Outfit-SemiBold',
    color: '#375064',
    fontSize: 14,
    marginBottom: 0,
    flex: 1,
  },
})

export default TimeSheetCard
