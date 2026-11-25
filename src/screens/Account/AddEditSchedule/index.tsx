import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native'
import moment from 'moment'
import { Calendar as CalendarModal } from 'react-native-calendars'
import {
  Button,
  BackButtonHeader,
  CustomSelect,
  DateFieldButton,
} from '@/components'
import DefaultModal from '@/components/Modals/DefaultModal'
import Colors from '@/utils/colors'
import { CheckboxEmpty, CheckboxFill } from '@/assets/icons/icon'
import TimeInput from '@/components/InputField/TimeInput'
import DaysSelect from '@/components/SelectOption/DaysSelect'
import { useFormik } from 'formik'
import Avatar from '@/components/Avatar/Avatar'
import { AddEditRecurringEvent } from '@/types/schedule'
import { recurringEventSchema } from './schema'
import {
  createSchedule,
  showSchedule,
  updateSchedule,
} from '@/requests/scheduleRequests'
import { WeekDay } from '@/types/weekDay'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { combineDateTime } from '@/utils/date'
import { deleteNotification } from '@/requests/notificationsRequests'

interface CalendarModal {
  isOpen: boolean
  selectedDate?: string
  field?: string
}

interface PendingChangeRequest {
  id: number
  startDate: string
  endDate?: string
  startTime: string
  endTime: string
}

type AddEditRecurringEventWithPendingChangeRequest = AddEditRecurringEvent & {
  pendingChangeRequest: PendingChangeRequest | null
}

const AddEditSchedule = ({ route, navigation }: any) => {
  const { id, employee } = route.params
  const isEditing = !!id

  const [calendarModal, setCalendarModal] = useState<CalendarModal>({
    isOpen: false,
  })
  const [isModalSubmit, setIsModalSubmit] = useState(false)
  const [initialValues, setInitialValues] =
    useState<AddEditRecurringEventWithPendingChangeRequest>({
      caregiverId: employee.id,
      pendingChangeRequest: null,
    })
  const [prevFieldValues, setPrevFieldValues] =
    useState<AddEditRecurringEvent | null>(null)
  const [isRemovingPending, setIsRemovingPending] = useState(false)

  const insets = useSafeAreaInsets()

  const getRepeatOptions = () => {
    const selectedWeekDay = moment(values.startDate).format('dddd')
    return [
      { label: 'Does not repeat', value: 'onetime' },
      { label: 'Every day', value: 'daily' },
      { label: `Weekly on ${selectedWeekDay}`, value: 'weekly' },
      { label: 'Monthly', value: 'monthly' },
      { label: 'Custom...', value: 'custom' },
    ]
  }

  const handleSave = async (values: AddEditRecurringEvent) => {
    if (values.repeat === 'daily') {
      const exclude = values.includeWeekends ? [] : [WeekDay.Sat, WeekDay.Sun]
      values = { ...values, exclude }
    }

    const action = isEditing
      ? () => updateSchedule(id, values)
      : () => createSchedule(values)

    const { data } = await action()

    if (data.success) {
      setPrevFieldValues(values)
      setIsModalSubmit(true)
    }
  }
  const { values, setFieldValue, handleSubmit, errors } =
    useFormik<AddEditRecurringEvent>({
      initialValues: initialValues,
      onSubmit: handleSave,
      validateOnChange: false,
      enableReinitialize: true,
      validate: (values) => {
        try {
          recurringEventSchema.validateSync(values, {
            context: { isEditing },
            abortEarly: false,
          })
        } catch (err: any) {
          const errors: Record<string, string> = {}
          if (err?.inner) {
            err.inner.forEach((error: any) => {
              if (error.path) {
                errors[error.path] = error.message
              }
            })
          }
          return errors
        }
      },
    })

  const isFormChanged = Object.keys(values).some((key) => {
    const typedKey = key as keyof AddEditRecurringEvent
    return (
      values[typedKey] !== '' &&
      (!prevFieldValues?.[typedKey] ||
        values[typedKey] !== prevFieldValues?.[typedKey])
    )
  })

  const isDisabled = !isFormChanged

  const buttonColor = isDisabled ? Colors.MediumGrey : Colors.PrimaryPurple
  const textColor = isDisabled ? Colors.BlackText : 'white'

  const confirmRemovePending = () => {
    Alert.alert(
      'Remove Change Request',
      'Are you sure you want to remove this pending change request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setIsRemovingPending(true)
            try {
              await deleteNotification(initialValues.pendingChangeRequest?.id)
              setInitialValues((prev) => ({
                ...prev,
                pendingChangeRequest: null,
              }))
            } catch (error) {
              console.error('Failed to remove pending change request:', error)
            } finally {
              setIsRemovingPending(false)
            }
          },
        },
      ]
    )
  }

  useEffect(() => {
    const fetchRecurringEvent = async () => {
      const { data } = await showSchedule(id)
      if (data.success) {
        setInitialValues((previous) => ({
          ...previous,
          ...data.recurringEvent,
        }))
      }
    }

    if (isEditing) {
      fetchRecurringEvent()
    }
  }, [isEditing])

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <BackButtonHeader
        header={isEditing ? 'View Schedule' : 'Schedule Employee'}
        navigation={navigation}
      />
      <ScrollView>
        <View style={styles.contentWrapper}>
          <View style={styles.nameWrapper}>
            <Avatar containerStyle={{ width: 32 }} source={employee.avatar} />
            <Text style={styles.employeeName}>{employee.fullName}</Text>
          </View>
          <View style={styles.twoColumnRow}>
            <DateFieldButton
              placeholder={isEditing ? 'Start Date' : 'Date'}
              value={values.startDate}
              containerStyle={{ flex: 1 }}
              style={{
                borderColor:
                  calendarModal.isOpen === true &&
                  calendarModal.field !== 'endDate'
                    ? Colors.PrimaryBlue
                    : Colors.LightGrey,
              }}
              onPressIn={() =>
                setCalendarModal({
                  isOpen: true,
                  field: 'startDate',
                  selectedDate: values.startDate,
                })
              }
              onChangeValue={(value) => setFieldValue('startDate', value)}
              error={errors.startDate}
            />
            {isEditing && (
              <DateFieldButton
                placeholder="End Date"
                value={values.endDate}
                containerStyle={{ flex: 1 }}
                style={{
                  borderColor:
                    calendarModal.isOpen === true &&
                    calendarModal.field === 'endDate'
                      ? Colors.PrimaryBlue
                      : Colors.LightGrey,
                }}
                onPressIn={() =>
                  setCalendarModal({
                    isOpen: true,
                    field: 'endDate',
                    selectedDate: values.endDate,
                  })
                }
                onChangeValue={(value) => setFieldValue('endDate', value)}
              />
            )}
          </View>
          <View style={styles.twoColumnRow}>
            <TimeInput
              placeholder="Start Time"
              value={values.startTime}
              setFieldValue={(value: any) => {
                setFieldValue('startTime', value)
              }}
              error={errors.startTime}
            />
            <TimeInput
              placeholder="End Time"
              value={values.endTime}
              setFieldValue={(value: any) => setFieldValue('endTime', value)}
              error={errors.endTime}
            />
          </View>
          {values.startDate && (
            <CustomSelect
              label="Repeat (optional)"
              options={getRepeatOptions()}
              selectedValue={values.repeat || ''}
              onSelect={(value) => setFieldValue('repeat', value)}
              useSearch={false}
              useDropdownStyle
              error={errors.repeat}
            />
          )}
          {values.repeat === 'daily' ? (
            <TouchableOpacity
              style={[styles.nameWrapper, { marginLeft: 5 }]}
              onPress={() =>
                setFieldValue('includeWeekends', !values.includeWeekends)
              }
            >
              {!values.includeWeekends ? <CheckboxEmpty /> : <CheckboxFill />}
              <Text style={[styles.text, { fontSize: 16 }]}>
                Include weekends
              </Text>
            </TouchableOpacity>
          ) : values.repeat === 'custom' ? (
            <DaysSelect
              onSelectionChange={(days) => setFieldValue('customRepeat', days)}
              initialSelectedDays={values.customRepeat}
              error={errors.customRepeat}
            />
          ) : null}

          {values.repeat && values.repeat !== 'onetime' && !isEditing && (
            <DateFieldButton
              placeholder="Ends on (optional)"
              value={values.endDate}
              style={{
                borderColor:
                  calendarModal.isOpen === true &&
                  calendarModal.field === 'endDate'
                    ? Colors.PrimaryBlue
                    : Colors.LightGrey,
              }}
              onPressIn={() =>
                setCalendarModal({
                  isOpen: true,
                  field: 'endDate',
                  selectedDate: values.endDate,
                })
              }
              onChangeValue={() => {}}
              error={errors.endDate}
            />
          )}
          {isEditing && initialValues.status === 'pending' && (
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={[styles.badge, styles.badgePending]}>
                  <Text style={styles.badgeText}>PENDING</Text>
                </View>
              </View>
              <Text style={styles.statusDescription}>
                Waiting for employee acceptance
              </Text>
            </View>
          )}
          {isEditing && initialValues.pendingChangeRequest && (
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={[styles.badge, styles.badgeWarning]}>
                  <Text style={styles.badgeText}>PENDING CHANGE REQUEST</Text>
                </View>
                {/* <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={confirmRemovePending}
                  disabled={isRemovingPending}
                >
                  {isRemovingPending ? (
                    <ActivityIndicator size="small" color={Colors.Red} />
                  ) : (
                    <Text style={styles.removeBtnText}>Remove</Text>
                  )}
                </TouchableOpacity> */}
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date & Time:</Text>
                  <Text style={styles.detailValue}>
                    {moment(
                      initialValues.pendingChangeRequest.startDate
                    ).format('MMM DD, YYYY')}
                    {' • '}
                    {moment(
                      combineDateTime(
                        initialValues.pendingChangeRequest.startTime
                      )
                    ).format('h:mm A')}
                    {' - '}
                    {moment(
                      combineDateTime(
                        initialValues.pendingChangeRequest.endTime
                      )
                    ).format('h:mm A')}
                  </Text>
                </View>
                {initialValues.pendingChangeRequest.endDate && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>End Date:</Text>
                    <Text style={styles.detailValue}>
                      {moment(
                        initialValues.pendingChangeRequest.endDate
                      ).format('MMM DD, YYYY')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <DefaultModal
        isVisible={calendarModal.isOpen}
        setModalVisible={(isOpen) => setCalendarModal({ isOpen })}
        modalstyle={styles.calendarModal}
        hideCloseButton
      >
        <CalendarModal
          onDayPress={({ dateString: selectedDate }) =>
            setCalendarModal((modal) => ({ ...modal, selectedDate }))
          }
          markedDates={{
            [calendarModal.selectedDate]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: Colors.LightBlue,
              selectedTextColor: Colors.BrightBlue,
            },
          }}
          theme={{
            todayTextColor: Colors.BrightBlue,
            textDayFontFamily: 'Outfit-Regular',
            textDayHeaderFontFamily: 'Outfit-Regular',
            textMonthFontFamily: 'Outfit-Regular',
          }}
          minDate={values.startDate}
          allowSelectionOutOfRange={false}
        />
        <View style={styles.buttonsModalRow}>
          <TouchableOpacity onPress={() => setCalendarModal({ isOpen: false })}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFieldValue(calendarModal.field, calendarModal.selectedDate)
              setCalendarModal({ isOpen: false })
            }}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </DefaultModal>
      <Button
        text={isEditing ? 'Save changes' : 'Submit schedule request'}
        disabled={isDisabled}
        buttonStyle={[styles.buttonStyle, { backgroundColor: buttonColor }]}
        textStyle={{ color: textColor }}
        onPress={() => {
          handleSubmit()
        }}
      />
      <DefaultModal
        isVisible={isModalSubmit}
        setModalVisible={setIsModalSubmit}
        modalstyle={styles.submitModal}
      >
        <View style={styles.textWrapper}>
          <Text style={styles.submitTitle}>Schedule requested</Text>
          <Text style={styles.text}>
            Your employee have received a schedule request. In the mean time,
            you can follow up the schedule status in the Schedules page.
          </Text>
        </View>
        <View style={[styles.twoColumnRow, { columnGap: null }]}>
          <Button
            text="Close"
            type="secondary"
            buttonStyle={styles.submitModalButton}
            onPress={() => navigation.goBack()}
          />
          <Button
            text="Go to Schedule"
            buttonStyle={styles.submitModalButton}
            onPress={() =>
              // React Navigation 7: `pop: true` keeps the v6 "go back" behaviour
              navigation.navigate(
                'Schedule',
                {
                  refresh: true,
                  initialDate: values.startDate,
                },
                { pop: true }
              )
            }
          />
        </View>
      </DefaultModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 24,
    rowGap: 24,
  },
  buttonStyle: {
    width: '87%',
    alignSelf: 'center',
  },
  calendarModal: {
    width: '95%',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,
  },
  buttonsModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.LightGrey,
    paddingTop: 14,
  },
  buttonText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.BrightBlue,
  },
  text: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.BlackText,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 24,
    width: '100%',
  },
  nameWrapper: {
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
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    color: Colors.DarkBlue,
    width: 250,
  },
  submitTitle: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: Colors.BlackText,
  },
  submitModal: {
    width: '95%',
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 24,
  },
  textWrapper: {
    rowGap: 8,
    marginBottom: 32,
    marginTop: -8,
  },
  submitModalButton: {
    width: '47%',
    paddingHorizontal: 10,
  },
  status: {
    fontStyle: 'italic',
    fontSize: 12,
    marginLeft: 5,
    color: Colors.BlackText,
  },
  title: {
    fontSize: 16,
  },
  textColor: {
    color: '#375064',
  },
  // New styles for improved UI
  statusCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeWarning: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
    color: '#92400E',
  },
  statusDescription: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.DarkGrey,
    marginTop: -4,
  },
  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    minWidth: 70,
    alignItems: 'center',
  },
  removeBtnText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 13,
    color: '#DC2626',
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 14,
    color: Colors.DarkBlue,
    minWidth: 90,
  },
  detailValue: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: Colors.BlackText,
    flex: 1,
  },
})

export default AddEditSchedule
