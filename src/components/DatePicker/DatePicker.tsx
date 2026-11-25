import moment from 'moment'
import InputField from '../InputField/InputField'
import BaseDatePicker from 'react-native-date-picker'
import CalendarIcon from '@/assets/icons/calendar.svg'
import { useState } from 'react'

const DatePicker = ({
  value,
  setFieldValue,
  error = undefined,
  placeholder = 'Date',
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const getValue = () => {
    const dateValue = value ? moment(value).toDate() : new Date()
    return dateValue
  }
  return (
    <>
      <InputField
        value={value ? moment(value).format('MM/DD/YYYY') : null}
        placeholder={placeholder}
        onPressIn={() => setDatePickerOpen(true)}
        rightIcon={CalendarIcon}
        error={error}
      />
      <BaseDatePicker
        modal
        mode="date"
        open={datePickerOpen}
        date={getValue()}
        onConfirm={(value) => {
          const formattedDate = moment(value).format('YYYY-MM-DD')
          setFieldValue(formattedDate)
          setDatePickerOpen(false)
        }}
        onCancel={() => setDatePickerOpen(false)}
      />
    </>
  )
}

export default DatePicker
