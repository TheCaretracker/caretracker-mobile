import moment from 'moment'
import InputField from '../InputField/InputField'
import BaseDatePicker from 'react-native-date-picker'
import CalendarIcon from '@/assets/icons/calendar.svg'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

const TimePicker = ({
  value,
  setFieldValue,
  error = undefined,
  placeholder = 'Time',
}) => {
  const [timePickerOpen, setTimePickerOpen] = useState(false)

  const getValue = () => {
    const dateValue = value ? moment(value, 'hh:mm a').toDate() : new Date()
    return dateValue
  }

  return (
    <>
      <TouchableOpacity
        style={{ flexShrink: 1, width: '100%' }}
        onPress={() => setTimePickerOpen(true)}
      >
        <InputField
          value={value ? moment(value, 'HH:mm a').format('hh:mm a') : null}
          placeholder={placeholder}
          onPressIn={() => setTimePickerOpen(true)}
          rightIcon={CalendarIcon}
          error={error}
        />
      </TouchableOpacity>
      <BaseDatePicker
        modal
        mode="time"
        open={timePickerOpen}
        date={getValue()}
        onConfirm={(value) => {
          const formattedTime = moment(value)
            .tz(moment.tz.guess())
            .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          setFieldValue(formattedTime)
          setTimePickerOpen(false)
        }}
        onCancel={() => setTimePickerOpen(false)}
      />
    </>
  )
}

export default TimePicker
