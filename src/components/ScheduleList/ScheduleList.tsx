import Colors from '@/utils/colors'
import { Alert } from 'react-native'
import { styled } from 'styled-components/native'
import ScheduleCard from '../ScheduleCard/ScheduleCard'
import moment from 'moment'
import { useCallback, useState } from 'react'
import {
  // acceptSchedule,
  getLinkedUsersFromSchedule,
} from '@/requests/scheduleRequests'
import ScheduleAcceptanceModal from '../ScheduleCard/ScheduleAcceptanceModal'

const ScheduleList = ({ selectedDate, data, triggerRefresh, navigation }) => {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    type?: 'accept' | 'decline'
    id?: number
  }>({ isOpen: false })

  // const handleConfirm = async (accept: boolean) => {
  //   const { data } = await acceptSchedule(confirmationModal.id, {
  //     accept: accept,
  //   })

  //   if (data.success) {
  //     Alert.alert(`Schedule successfully ${accept ? 'accepted' : 'declined'}`)
  //     setConfirmationModal({ isOpen: false })
  //     triggerRefresh()
  //   }
  // }

  const goToEdit = useCallback(async (recurringEventId: number) => {
    const { data } = await getLinkedUsersFromSchedule(recurringEventId)
    if (!data.success) return

    navigation.navigate('AddEditSchedule', {
      id: recurringEventId,
      employee: data.employee,
    })
  }, [])

  const renderCards = () => {
    const dateSchedule = data[selectedDate]
    return dateSchedule
      ? dateSchedule.map(
          ({
            recurringEventId,
            marking,
            name,
            startTime,
            endTime,
            status,
            type,
          }) => (
            <ScheduleCard
              key={`${recurringEventId}-${startTime}-${endTime}`}
              dotColor={marking.color}
              timeInterval={[
                moment.utc(startTime).local().format('hh:mm A'),
                moment.utc(endTime).local().format('hh:mm A'),
              ].join(' - ')}
              name={name}
              status={status}
              type={type}
              onAccept={() =>
                setConfirmationModal({
                  isOpen: true,
                  id: recurringEventId,
                  type: 'accept',
                })
              }
              onDecline={() =>
                setConfirmationModal({
                  isOpen: true,
                  id: recurringEventId,
                  type: 'decline',
                })
              }
              onViewDetails={() => goToEdit(recurringEventId)}
            />
          )
        )
      : []
  }
  const formattedDate = moment(selectedDate).format('MMMM DD')
  return (
    <Container>
      <Date>{formattedDate}</Date>
      <ScheduleCards>{renderCards()}</ScheduleCards>
      <ScheduleAcceptanceModal
        id={confirmationModal.id}
        type={confirmationModal.type}
        isVisible={confirmationModal.isOpen}
        setIsModalVisible={(isOpen) => setConfirmationModal({ isOpen })}
        triggerRefresh={triggerRefresh}
      />
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
`

const Date = styled.Text`
  color: ${Colors.DarkGrey};
  font-family: 'Outfit-Regular';
  font-size: 12px;
  margin-bottom: 3px;
`
const ScheduleCards = styled.View`
  gap: 5px;
`
export default ScheduleList
