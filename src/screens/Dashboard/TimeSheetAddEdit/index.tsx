import {
  BackButtonHeader,
  Button,
  CustomSelect,
  DateFieldButton,
} from '@/components'
import Avatar from '@/components/Avatar/Avatar'
import TimeInput from '@/components/InputField/TimeInput'
import CalendarModal from '@/components/Modals/CalendarModal'
import { UserDataContext } from '@/contexts/UserDataContext'
import globalStyles from '@/globalStyles'
import {
  listEmploymentRecurringEvents,
  listEmploymentUsers,
} from '@/requests/employmentRequests'
import {
  createEvent,
  showEvent,
  updateEvent,
} from '@/requests/workEventsRequests'
import { repeatString } from '@/utils/repeat'
import { useFormik } from 'formik'
import moment from 'moment'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { timesheetAddSchema } from './schema'
import { combineDateTimeLocal } from '@/utils/date'

const TimeSheetAddEdit = ({ navigation, route }) => {
  const id = route?.params?.id
  const isEdit = id != null

  const [event, setEvent] = useState({})
  const { isEmployer } = useContext(UserDataContext)
  const [employments, setEmployments] = useState([])
  const [schedules, setSchedules] = useState({})

  const [calendarModal, setCalendarModal] = useState({ isOpen: false })

  const onSubmit = async () => {
    const event: any = {
      ...values,
    }

    event.clockIn = combineDateTimeLocal(
      event.clockIn,
      event.clockInDate || event.date
    )
    event.clockOut = combineDateTimeLocal(
      event.clockOut,
      event.clockOutDate || event.date
    )

    const { data } = isEdit
      ? await updateEvent(id, event)
      : await createEvent(event)

    if (data.success) {
      Alert.alert(
        'Success',
        `Successfully created Timesheet entry request. Your ${
          isEmployer ? 'employee' : 'employer'
        } will receive a notification to review it before it's approved.`,
        [
          {
            text: 'Done',
            onPress: () => {
              navigation.goBack()
            },
          },
        ]
      )
    }
  }
  const { values, setFieldValue, handleSubmit, errors, isSubmitting } =
    useFormik({
      initialValues: event,
      onSubmit: onSubmit,
      validationSchema: timesheetAddSchema,
      validateOnChange: false,
      enableReinitialize: true,
    })

  useEffect(() => {
    const fetchScheduleEvent = async () => {
      const { data } = await showEvent(id)
      if (data.success) {
        const clockInDate = moment(data.event.clockIn).format('YYYY-MM-DD')
        const clockOutDate = moment(data.event.clockOut).format('YYYY-MM-DD')

        const clockInTime = moment(data.event.clockIn)
        const clockOutTime = moment(data.event.clockOut)

        setEvent({
          ...data.event,
          clockInDate,
          clockOutDate,
          clockIn: clockInTime,
          clockOut: clockOutTime,
        })
      }
    }
    if (isEdit) {
      fetchScheduleEvent()
    }
  }, [id])

  useEffect(() => {
    const fetchEmploymentUsers = async () => {
      const params = isEdit ? { ids: event.employmentLinkId } : {}
      const { data } = await listEmploymentUsers(params)
      if (data.success) {
        const options = data.employments.map((entry) => {
          const user = isEmployer ? entry.employee : entry.employer
          return {
            value: entry.id,
            label: user.fullName,
            avatar: user.avatar,
          }
        })

        setEmployments(options)
      }
    }
    fetchEmploymentUsers()
  }, [event])

  useEffect(() => {
    const fetchSchedules = async () => {
      const { data } = await listEmploymentRecurringEvents(
        values.employmentLinkId
      )
      if (data.success) {
        setSchedules((previous) => ({
          ...previous,
          [values.employmentLinkId]: data.recurring_events.map((event) => ({
            label: scheduleLabel(event),
            value: event.id,
            event,
          })),
        }))
      }
    }
    if (values.employmentLinkId != null) fetchSchedules()
  }, [values.employmentLinkId])

  const selectedSchedule = useMemo(
    () =>
      schedules[values.employmentLinkId]?.find(
        ({ value }) => value === values.recurringEventId
      )?.event,
    [schedules, values.recurringEventId]
  )

  const scheduleLabel = (event) => {
    return `${moment(event.startDate).format('MMMM DD, YYYY')} | ${moment
      .utc(event.startTime)
      .local()
      .format(
        'hh:mm A'
      )} - ${moment.utc(event.endTime).local().format('hh:mm A')}`
  }

  const renderScheduleOption = (data) => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          justifyContent: 'center',
        }}
      >
        <Text style={globalStyles.bodyTextRegular}>{data.label}</Text>
        {data.event?.repeat && data.event?.repeat !== 'onetime' && (
          <Text style={globalStyles.bodyTextLight}>
            {repeatString(data.event)}
          </Text>
        )}
      </View>
    )
  }

  const renderUserOption = ({ label, avatar }) => {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          padding: 10,
          flex: 1,
        }}
      >
        {avatar && <Avatar containerStyle={{ width: 32 }} source={avatar} />}
        <Text style={[globalStyles.bodyTextRegular, { marginLeft: 5 }]}>
          {label}
        </Text>
      </View>
    )
  }

  const maxDate = useMemo(
    () =>
      moment
        .max([moment(selectedSchedule?.endDate), moment()])
        .format('YYYY-MM-DD'),
    [selectedSchedule]
  )

  const getScheduleOptions = () => {
    return schedules[values.employmentLinkId] &&
      schedules[values.employmentLinkId].length
      ? schedules[values.employmentLinkId]
      : [{ label: 'No schedules found for this user' }]
  }

  return (
    <View style={{ gap: 40, paddingHorizontal: 12 }}>
      <BackButtonHeader navigation={navigation} header="Add New Record" />
      <CustomSelect
        options={
          employments.length
            ? employments
            : [
                {
                  label: `No ${isEmployer ? 'employees' : 'employers'} found`,
                },
              ]
        }
        selectedValue={values.employmentLinkId}
        label={isEmployer ? 'Employee' : 'Employer'}
        onSelect={(value) => setFieldValue('employmentLinkId', value)}
        renderItem={renderUserOption}
      />
      {values.employmentLinkId && (
        <>
          <CustomSelect
            options={getScheduleOptions()}
            selectedValue={values.recurringEventId}
            label="Schedule"
            onSelect={(value) => setFieldValue('recurringEventId', value)}
            renderItem={renderScheduleOption}
          />
          {values.recurringEventId && (
            <>
              {!isEdit && (
                <View>
                  <DateFieldButton
                    placeholder="Date"
                    value={values.date}
                    onPressIn={() =>
                      setCalendarModal({
                        isOpen: true,
                        selectedDate: values.date,
                        field: 'date',
                      })
                    }
                    error={errors.date}
                  />
                </View>
              )}
              <View style={{ marginTop: 30, gap: 15 }}>
                {isEdit && (
                  <View style={{ flexDirection: 'row' }}>
                    <DateFieldButton
                      placeholder="Clock In Date"
                      value={values.clockInDate}
                      onPressIn={() =>
                        setCalendarModal({
                          isOpen: true,
                          selectedDate: values.clockInDate,
                          field: 'clockInDate',
                        })
                      }
                      error={errors.clockInDate}
                    />
                    <DateFieldButton
                      placeholder="Clock Out Date"
                      value={values.clockOutDate}
                      onPressIn={() =>
                        setCalendarModal({
                          isOpen: true,
                          selectedDate: values.clockOutDate,
                          field: 'clockOutDate',
                        })
                      }
                      error={errors.clockOutDate}
                    />
                  </View>
                )}

                <View style={{ flexDirection: 'row' }}>
                  <TimeInput
                    value={values.clockIn}
                    placeholder="Clock In Time"
                    setFieldValue={(value) => {
                      setFieldValue('clockIn', value)
                    }}
                    error={errors.clockIn}
                  />
                  <TimeInput
                    value={values.clockOut}
                    placeholder="Clock Out Time"
                    setFieldValue={(value) => setFieldValue('clockOut', value)}
                    error={errors.clockOut}
                  />
                </View>
              </View>
              <Button
                text="Submit"
                onPress={handleSubmit}
                busy={isSubmitting}
              />
            </>
          )}
        </>
      )}

      <CalendarModal
        isVisible={calendarModal.isOpen}
        setModalVisible={(isOpen) => setCalendarModal({ isOpen })}
        minDate={selectedSchedule?.startDate}
        maxDate={maxDate}
        onDayPress={(day) =>
          setCalendarModal((previous) => ({
            ...previous,
            selectedDate: day.dateString,
          }))
        }
        onPressCancel={() => setCalendarModal({ isOpen: false })}
        onPressDone={() => {
          setFieldValue(calendarModal.field, calendarModal.selectedDate)
          setCalendarModal({ isOpen: false })
        }}
        selectedDate={calendarModal.selectedDate}
      />
    </View>
  )
}

export default TimeSheetAddEdit
