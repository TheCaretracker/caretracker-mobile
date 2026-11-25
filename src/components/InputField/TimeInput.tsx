import { useRef, useState } from 'react'
import TimePicker from '../TimePicker/TimePicker'

interface TimeInputProps {
  value: any
  placeholder: string
  setFieldValue: any
  error?: string
}

interface TimeOption {
  label: string
  value: string
}

const TimeInput = ({
  value,
  placeholder,
  setFieldValue,
  error,
}: TimeInputProps) => {
  const [isFocus, setIsFocus] = useState(false)

  const options = [
    { label: 'AM', value: 'am' },
    { label: 'PM', value: 'pm' },
  ]
  const inputRef = useRef(null)

  const parseTimeString = (inputString: string) => {
    if (!inputString) return null
    const date = new Date(inputString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const amOrPm = hours >= 12 ? 'PM' : 'AM'
    return {
      time: `${((hours + 11) % 12) + 1}:${minutes < 10 ? '0' : ''}${minutes}`,
      period: amOrPm,
    }
  }

  const parsedValue = parseTimeString(value)

  const setCursorPosition = (position) => {
    inputRef.current.setNativeProps({
      selection: { start: position, end: position },
    })
  }
  const selectedOption = options.find(
    (option) =>
      option.value?.toLowerCase() === parsedValue?.period?.toLowerCase()
  )
  const mask = (value: string): string => {
    // replace non-numeric characters
    value = value.replace(/:|[a-zA-Z]/g, '')

    let hours = value.slice(0, 2)
    if (parseInt(hours) > 1) {
      hours = parseInt(hours) < 10 && hours.length < 2 ? `0${hours}` : hours
      hours = parseInt(hours) > 12 ? '12' : hours
    } else if (hours.length == 2 && parseInt(hours) == 0) {
      hours = '12'
    }

    let minutes = value.slice(2)

    if (parseInt(minutes) > 5) {
      minutes = parseInt(minutes) < 10 ? `0${minutes}` : minutes
      minutes = parseInt(minutes) > 59 ? '59' : minutes
    }

    if (value.length < 3) {
      return `${hours}`
    }

    return `${hours}:${minutes}`
  }

  return (
    <TimePicker
      error={error}
      value={parsedValue ? `${parsedValue?.time} ${parsedValue?.period}` : null}
      setFieldValue={(value) => setFieldValue(value)}
      placeholder={placeholder}
    />
  )
}

export default TimeInput
