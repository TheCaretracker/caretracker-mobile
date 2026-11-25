import { useState } from 'react'
import moment from 'moment'
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native'
import {
  Button,
  BackButtonHeader,
  DateFieldButton,
  CustomSelect,
} from '@/components'
import TimeInput from '@/components/InputField/TimeInput'
import CalendarModal from '@/components/Modals/CalendarModal'
import DaysSelect from '@/components/SelectOption/DaysSelect'
import Colors from '@/utils/colors'
import { CheckboxEmpty, CheckboxFill } from '@/assets/icons/icon'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const options = [
  { label: 'Does not repeat', value: 'Does not repeat' },
  { label: 'Every day', value: 'Every day' },
  { label: 'Weekly on Tuesday', value: 'Weekly on Tuesday' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Custom...', value: 'Custom...' },
]

type valuesType = {
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  repeat?: string
  weekend?: boolean
  customDays?: string[]
}

const EmployeeViewSchedule = ({ navigation }: any) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activateEndDateModal, setActivateEndDateModal] = useState(false)
  const initialValues = {
    startDate: '2023-08-28',
    endDate: '2023-09-28',
    startTime: '05:00 am',
    endTime: '11:00 am',
    repeat: 'Monthly',
  }
  const [values, setValues] = useState<valuesType>({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    repeat: '',
    weekend: false,
    customDays: [],
  })
  const [startDate, setStartDate] = useState<string>('2023-08-28')
  const [endDate, setEndDate] = useState<string>('2023-09-28')
  const [startTime, setStartTime] = useState<string>('05:00 am')
  const [endTime, setEndTime] = useState<string>('11:00 am')
  const [repeat, setRepeat] = useState<string>('Monthly')
  const [includeWeekend, setIncludeWeekend] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const insets = useSafeAreaInsets()

  const isDisabled =
    initialValues.startDate === startDate &&
    initialValues.endDate === endDate &&
    initialValues.startTime === startTime &&
    initialValues.endTime === endTime &&
    initialValues.repeat === repeat
      ? true
      : false
  const buttonColor = isDisabled ? Colors.MediumGrey : Colors.PrimaryPurple
  const textColor = isDisabled ? Colors.BlackText : 'white'

  const handleOpenStartDateModal = () => {
    setIsVisible(true)
    setActivateEndDateModal(false)
  }
  const handleOpenEndDateModal = () => {
    setIsVisible(true)
    setActivateEndDateModal(true)
  }
  const handleSaveChanges = () => {
    setValues(values)
    setTimeout(() => navigation.goBack(), 1000)
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <BackButtonHeader header="View Schedule" navigation={navigation} />
      <ScrollView>
        <View style={styles.contentWrapper}>
          <View style={styles.nameWrapper}>
            <Image
              source={require('../../../assets/images/employer4.png')}
              resizeMode="contain"
              style={styles.avatarStyle}
            />
            <Text style={styles.employeeName}>{'Employee name'}</Text>
          </View>
          <View style={styles.twoColumnRow}>
            <DateFieldButton
              placeholder="Start Date"
              style={{ width: '47%' }}
              value={startDate ? moment(startDate).format('MM/DD/YYYY') : null}
              onPressIn={handleOpenStartDateModal}
              onChangeValue={() =>
                setValues((prev) => ({ ...prev, startDate: startDate }))
              }
            />
            <DateFieldButton
              placeholder="End Date"
              style={{ width: '47%' }}
              value={endDate ? moment(endDate).format('MM/DD/YYYY') : null}
              onPressIn={handleOpenEndDateModal}
              onChangeValue={() =>
                setValues((prev) => ({ ...prev, endDate: endDate }))
              }
            />
          </View>
          <View style={styles.twoColumnRow}>
            <TimeInput
              placeholder="Start time"
              value={startTime}
              setFieldValue={(value: string) => {
                setValues((prev) => ({ ...prev, startTime: value }))
                setStartTime(value)
              }}
            />
            <TimeInput
              placeholder="End time"
              value={endTime}
              setFieldValue={(value: string) => {
                setValues((prev) => ({ ...prev, endTime: value }))
                setEndTime(value)
              }}
            />
          </View>
          <CustomSelect
            label="Repeat (optional)"
            options={options}
            selectedValue={repeat}
            onSelect={(value) => {
              setValues((prev) => ({ ...prev, repeat: value }))
              setRepeat(value)
            }}
            useSearch={false}
            useDropdownStyle
          />
          {repeat === 'Every day' ? (
            <TouchableOpacity
              style={[styles.nameWrapper, { marginLeft: 5 }]}
              onPress={() => {
                setIncludeWeekend(!includeWeekend)
                setValues((prev) => ({ ...prev, weekend: !includeWeekend }))
              }}
            >
              {!includeWeekend ? <CheckboxEmpty /> : <CheckboxFill />}
              <Text style={styles.text}>Include weekends</Text>
            </TouchableOpacity>
          ) : repeat === 'Custom...' ? (
            <DaysSelect
              onSelectionChange={(days) => {
                setSelectedDays(days)
                setValues((prev) => ({ ...prev, customDays: days }))
              }}
              initialSelectedDays={selectedDays}
            />
          ) : null}
        </View>
      </ScrollView>
      <CalendarModal
        isVisible={isVisible}
        setModalVisible={setIsVisible}
        onDayPress={(day) => {
          if (activateEndDateModal) {
            setEndDate(day.dateString)
          } else {
            setStartDate(day.dateString)
          }
        }}
        selectedDate={activateEndDateModal ? endDate : startDate}
        onPressCancel={() => {
          setIsVisible(false)
          if (activateEndDateModal) {
            setEndDate(initialValues.endDate)
          } else {
            setStartDate(initialValues.startDate)
          }
        }}
        onPressDone={() => {
          setIsVisible(false)
          if (activateEndDateModal) {
            setValues((prev) => ({ ...prev, endDate: endDate }))
          } else {
            setValues((prev) => ({ ...prev, startDate: startDate }))
          }
        }}
      />
      <Button
        text="Save Changes"
        disabled={isDisabled}
        buttonStyle={[styles.buttonStyle, { backgroundColor: buttonColor }]}
        textStyle={{ color: textColor }}
        onPress={handleSaveChanges}
      />
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
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 24,
    width: '100%',
  },
  text: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    color: Colors.BlackText,
  },
  buttonStyle: {
    width: '87%',
    alignSelf: 'center',
  },
})

export default EmployeeViewSchedule
