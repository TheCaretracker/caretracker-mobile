import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import {
  ArrowDownCustom as ArrowDown,
  Clock as ClockIcon,
  ClockCustom,
} from '@/assets/icons/icon'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Button from '../Button/Button'
import moment from 'moment-timezone'
import {
  clockIn,
  clockOut,
  listWorkEvents,
} from '@/requests/workEventsRequests'
import { combineDateTime, formatHourRange } from '@/utils/date'
import { getLinkedUsersFromSchedule } from '@/requests/scheduleRequests'
import { Role } from '@/contexts/UserDataContext'
import { useFocusEffect } from '@react-navigation/native'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { NotificationTypeEnum } from '@/screens/Notification/NotificationTypeEnum'

enum ActionType {
  ClockIn = 'in',
  ClockOut = 'out',
}

export interface ScheduleItem {
  name: string
  date: string
  startTime: string
  endTime: string
  recurringEventId: number
  eventId: number | null
  entries: { clockIn: string; clockOut?: string }[]
}

interface ScheduleCardProps {
  toggleIsOut: (id: number) => void
  userType?: Role | null
  navigation?: any
}

const YourScheduleCard = ({
  userType = Role.Employee,
  navigation,
}: ScheduleCardProps) => {
  const [loadingItem, setLoadingItem] = useState('')
  const [numberOfItemsToShow, setNumberOfItemsToShow] = useState(2)
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const limitRef = useRef(2)

  const { registerNotificationCallback } = useContext(NotificationsContext)

  const fetchSchedules = useCallback(async () => {
    const { data } = await listWorkEvents(limitRef.current)

    if (data.success) {
      setSchedules(
        [...(data.today_schedule || []), ...(data.next_occurrences || [])]
        // filter out duplicates based on recurringEventId and date
        // .filter(
        //   (v, i, a) =>
        //     a.findIndex(
        //       (t) =>
        //         t.recurringEventId === v.recurringEventId && t.date === v.date
        //     ) === i
        // )
      )
    }
  }, [])

  const setScheduleData = useCallback((data: any) => {
    setSchedules((prev) => {
      // Find and update item that has same startTime, endTime, and recurringEventId
      const index = prev.findIndex(
        (item) =>
          item.date === data.date &&
          item.recurringEventId === data.recurringEventId
      )

      if (index !== -1) {
        // If found, create a new array with the updated item
        const updatedSchedules = [...prev]
        updatedSchedules[index] = {
          ...updatedSchedules[index],
          eventId: data.eventId,
          entries: data.entries,
        }
        return updatedSchedules
      } else {
        return prev
      }
    })
  }, [])

  const handleShowMore = useCallback(async () => {
    // If there are still at least 2 undisplayed items, just show more
    if (numberOfItemsToShow < schedules.length) {
      if (numberOfItemsToShow === 2 && schedules.length > 4) {
        setNumberOfItemsToShow(Math.max(4, schedules.length - 2))
        return
      }
      setNumberOfItemsToShow(schedules.length)
    }

    // If only one undisplayed item left, try to fetch more before showing

    limitRef.current += 2
    fetchSchedules()
  }, [numberOfItemsToShow, schedules.length, fetchSchedules])

  const getClockType = useCallback((item: ScheduleItem): ActionType => {
    const entries = item.entries || []
    /*
      entries = [
        {
          clockIn: '2024-10-01T09:00:00Z',
          clockOut: '2024-10-01T17:00:00Z'
        },
        {
          clockIn: '2024-10-02T09:00:00Z'
        },
      ]
    */
    const numOfClockedIn = entries.filter((entry) => entry.clockIn).length
    const numOfClockedOut = entries.filter((entry) => entry.clockOut).length

    if (numOfClockedIn > numOfClockedOut) {
      return ActionType.ClockOut
    }
    return ActionType.ClockIn
  }, [])

  useEffect(() => {
    registerNotificationCallback((data) => {
      if (
        [
          NotificationTypeEnum.ScheduleChangeAccept,
          NotificationTypeEnum.EmployeeClockIn,
          NotificationTypeEnum.EmployeeClockOut,
        ].includes(data?.type)
      ) {
        fetchSchedules()
      }
    })
  }, [fetchSchedules, registerNotificationCallback])

  useFocusEffect(
    useCallback(() => {
      fetchSchedules()
    }, [])
  )

  const handleClockButton = async (item: ScheduleItem) => {
    setLoadingItem(`${item.recurringEventId}-${item.date}`)
    try {
      const actionType = getClockType(item)
      const action = () =>
        actionType === ActionType.ClockOut
          ? clockOut(item.eventId)
          : clockIn({
              recurringEventId: item.recurringEventId,
              date: item.date,
            })

      const { data } = await action()

      if (data.success) {
        setScheduleData(data.current_event || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingItem('')
    }
  }

  const goToEdit = useCallback(async (recurringEventId: number) => {
    const { data } = await getLinkedUsersFromSchedule(recurringEventId)
    if (!data.success) return

    navigation.navigate('AddEditSchedule', {
      id: recurringEventId,
      employee: data.employee,
    })
  }, [])

  const allShown = numberOfItemsToShow >= schedules.length

  return (
    <ScheduleCardContainer>
      <Row>
        <CardTitle>Your Schedule</CardTitle>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Schedule')
          }}
        >
          <CardLink>My Schedule</CardLink>
        </TouchableOpacity>
      </Row>
      {schedules.slice(0, numberOfItemsToShow)?.map((item, index: number) => {
        const actionType = getClockType(item)

        const key = `${item.recurringEventId}-${item.date}`
        // Determine clock color
        const clockColor =
          loadingItem === key
            ? '#bbb'
            : actionType === ActionType.ClockOut
              ? '#FD5252'
              : '#4440D6'

        return (
          <View
            key={key}
            style={{
              borderBottomWidth: 1,
              paddingBottom: 8,
              borderBottomColor: '#eaebec',
            }}
          >
            <TouchableOpacity
              disabled={userType === Role.Employee}
              onPress={() => goToEdit(item.recurringEventId)}
            >
              <Name>{item.name}</Name>
              <InlineRow>
                <DateTime>
                  {moment(item.date).format('MMM DD, YYYY')}{' '}
                  {formatHourRange(
                    combineDateTime(item.startTime),
                    combineDateTime(item.endTime)
                  )}
                </DateTime>
              </InlineRow>
            </TouchableOpacity>
            {userType === Role.Employee && (
              <Button
                disabled={loadingItem === key}
                text={
                  actionType === ActionType.ClockOut ? 'Clock Out' : 'Clock In'
                }
                type={
                  actionType === ActionType.ClockOut ? 'clock out' : 'secondary'
                }
                icon={<ClockCustom color={clockColor} />}
                onPress={() => handleClockButton(item)}
                buttonStyle={{ marginTop: 16 }}
              />
            )}
            <View style={{ marginTop: 8 }}>
              {item.entries?.map((entry, entry_index: number) => (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  key={`${key}_${entry_index}`}
                >
                  <ClockIcon color="#6d767c" width={24} height={24} />
                  <DateTimeSmall>
                    {moment(entry.clockIn).format('MMM DD hh:mm A')}{' '}
                    <MediumDash>~</MediumDash>{' '}
                    {entry.clockOut ? (
                      moment(entry.clockOut).format('MMM DD hh:mm A')
                    ) : (
                      <InProgressLabel>Clocked in</InProgressLabel>
                    )}
                  </DateTimeSmall>
                </View>
              ))}
            </View>
          </View>
        )
      })}
      {/* Show All button */}
      {schedules.length > 2 && (
        <Row>
          <TouchableOpacity onPress={handleShowMore} disabled={allShown}>
            <Row style={{ justifyContent: 'center', gap: 8 }}>
              <SubTitle
                style={[
                  { textAlign: 'center', fontSize: 14 },
                  allShown && { color: '#6D767C' },
                ]}
              >
                Show More
              </SubTitle>
              <ArrowDown color={allShown ? '#6D767C' : '#2E2E2E'} />
            </Row>
          </TouchableOpacity>
          {numberOfItemsToShow > 2 && (
            <TouchableOpacity onPress={() => setNumberOfItemsToShow(2)}>
              <Row style={{ justifyContent: 'center', gap: 8 }}>
                <SubTitle style={{ textAlign: 'center', fontSize: 14 }}>
                  Show Less
                </SubTitle>
                <ArrowDown style={{ transform: [{ rotate: '180deg' }] }} />
              </Row>
            </TouchableOpacity>
          )}
        </Row>
      )}
      {/* {nextDayData?.length > 0 && (
        <NexDateContainer>
          <TouchableOpacity
            onPress={() => setShowNextContent(!showNextContent)}
          >
            <Row>
              <SubTitle>Show more</SubTitle>
              {showNextContent ? (
                <ArrowDown style={{ transform: [{ rotate: '180deg' }] }} />
              ) : (
                <ArrowDown />
              )}
            </Row>
          </TouchableOpacity>
          {showNextContent && (
            <>
              {nextDayData?.map((item: any) => (
                <View key={`${item.recurringEventId}-${item.date}`}>
                  <TouchableOpacity
                    disabled={userType === 'employee'}
                    onPress={() => goToEdit(item.recurringEventId)}
                  >
                    <NameSmall>{item.name}</NameSmall>
                    <InlineRow>
                      <DateTimeSmall>
                        {formatDate(item.date)}{' '}
                        {formatHourRange(
                          combineDateTime(item.startTime),
                          combineDateTime(item.endTime)
                        )}
                      </DateTimeSmall>
                    </InlineRow>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </NexDateContainer>
      )} */}
    </ScheduleCardContainer>
  )
}

export default YourScheduleCard

const ScheduleCardContainer = styled.View`
  border-radius: 16px;
  background-color: white;
  min-height: 100px;
  padding: 16px;
  row-gap: 16px;
  flex-grow: 1;
  width: 100%;
`
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const View = styled.View``
const NexDateContainer = styled.View`
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #eaebec;
  padding-top: 16px;
  row-gap: 16px;
`
const InlineRow = styled(Row)`
  justify-content: flex-start;
  column-gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
  column-gap: 10px;
`
const CardTitle = styled.Text`
  font-family: 'Outfit-SemiBold';
  color: #375064;
  font-size: 18px;
`
const CardLink = styled.Text`
  font-family: 'Outfit-Regular';
  color: #4440d6;
  font-size: 12px;
  text-decoration: underline;
`
const Name = styled(CardTitle)`
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 17.5px;
`
const DateTime = styled.Text`
  font-family: 'Outfit-Regular';
  font-size: 14px;
  color: #6d767c;
`
const SubTitle = styled(CardTitle)`
  font-size: 12px;
  color: #2e2e2e;
`
const NameSmall = styled(CardTitle)`
  font-size: 14px;
  margin-bottom: 4px;
  color: #6d767c;
`
const DateTimeSmall = styled(DateTime)`
  font-size: 12px;
`
const InProgressLabel = styled.Text`
  font-family: 'Outfit-SemiBold';
  color: #4440d6;
  font-size: 12px;
`
const MediumDash = styled.Text`
  color: #6d767c;
  font-size: 12px;
`
