import { View } from 'react-native'
import { Button } from '@/components'
import Calendar from '@/components/Calendar/Calendar'
import moment from 'moment'
import ScheduleList from '@/components/ScheduleList/ScheduleList'
import { useCallback, useContext, useEffect, useState } from 'react'
import { buildCalendarObject } from './helper'
import AppLayout from '@/layouts/AppLayout'
import TimeOffRequestModal from './TimeOffRequestModal'
import { listSchedule } from '@/requests/scheduleRequests'
import { DateData } from 'react-native-calendars'
import { UserDataContext } from '@/contexts/UserDataContext'
import { dots } from './consts'
import { useFocusEffect } from '@react-navigation/native'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { NotificationTypeEnum } from '../Notification/NotificationTypeEnum'

const Schedule = ({ route, navigation }: any) => {
  const { isEmployee } = useContext(UserDataContext)
  const { registerNotificationCallback } = useContext(NotificationsContext)
  const { initialDate } = route?.params || {}

  const today = moment().format('YYYY-MM-DD')

  const [selectedDate, setSelectedDate] = useState(initialDate || today)
  const [timeOffModalOpen, setTimeOffModalOpen] = useState(false)
  const [triggerRefresh, setTriggerRefresh] = useState(false)

  const [scheduleData, setScheduleData] = useState({})

  const forceRefresh = () => {
    setTriggerRefresh((previous) => !previous)
  }

  // try not to call fetchScheduleData directly
  // we are using a refresh state to control updates to the screen
  const fetchScheduleData = async (startDate?: Date) => {
    const { data } = await listSchedule({ startDate })
    // console.log('Schedule data fetched', JSON.stringify(data.schedule, null, 2))
    if (data.success) {
      mergeCalendarData(data.schedule)
    }
  }

  const mergeCalendarData = (newData) => {
    const newCalendarData = buildCalendarObject(newData, dots)
    setScheduleData(newCalendarData)
  }

  const handleMonthChange = (dateData: DateData) => {
    const date = new Date(dateData.dateString)

    fetchScheduleData(date)
  }

  useFocusEffect(
    useCallback(() => {
      forceRefresh()
    }, [])
  )

  useEffect(() => {
    fetchScheduleData()
  }, [triggerRefresh])

  useEffect(() => {
    registerNotificationCallback((data) => {
      if (
        [
          NotificationTypeEnum.ScheduleChangeAccept,
          NotificationTypeEnum.ScheduleAccept,
        ].includes(data?.type)
      ) {
        fetchScheduleData()
      }
    })
  }, [registerNotificationCallback])

  const renderButton = () =>
    isEmployee ? (
      // <Button
      //   type="secondary"
      //   text={'Time Off Request'}
      //   buttonStyle={{ marginVertical: 20 }}
      //   onPress={() => setTimeOffModalOpen(true)}
      // />
      <View style={{ marginVertical: 10 }} />
    ) : (
      <Button
        type="secondary"
        text={'Schedule'}
        buttonStyle={{ marginVertical: 20 }}
        onPress={() => navigation.navigate('MyEmployees')}
      />
    )

  return (
    <AppLayout title="Schedule" navigation={navigation}>
      <Calendar
        data={scheduleData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onMonthChange={(date) => handleMonthChange(date)}
      />
      {renderButton()}

      <ScheduleList
        data={scheduleData}
        selectedDate={selectedDate}
        triggerRefresh={forceRefresh}
        navigation={navigation}
      />
      <View style={{ height: 20 }} />
      <TimeOffRequestModal
        modalOpen={timeOffModalOpen}
        setModalOpen={setTimeOffModalOpen}
        onCreateRequest={forceRefresh}
        day={selectedDate}
      />
    </AppLayout>
  )
}

export default Schedule
