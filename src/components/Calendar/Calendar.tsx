import { Dispatch, SetStateAction, useMemo } from 'react'
import {
  Calendar as BaseCalendar,
  CalendarProps as BaseCalendarProps,
} from 'react-native-calendars'
import CustomDay from './CustomDay'
import styled from 'styled-components/native'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'

interface CalendarProps extends BaseCalendarProps {
  data: any
  selectedDate: string
  setSelectedDate: Dispatch<SetStateAction<string>>
}
const Calendar = ({
  data,
  selectedDate,
  setSelectedDate,
  ...rest
}: CalendarProps) => {
  const marked = useMemo(() => {
    const markedObj = { ...data }
    markedObj[selectedDate] = {
      ...markedObj[selectedDate],
      selected: true,
      disableTouchEvent: true,
    }

    return markedObj
  }, [data, selectedDate])

  return (
    <CalendarContainer>
      <BaseCalendar
        markingType="multi-dot"
        onDayPress={(date) => setSelectedDate(date.dateString)}
        markedDates={marked}
        style={{
          flex: 1,
          padding: 10,
        }}
        theme={{
          weekVerticalMargin: 0,
          textDayHeaderFontFamily: 'Outfit-Regular',
          textMonthFontFamily: 'Outfit-Regular',
        }}
        renderArrow={(direction) =>
          direction === 'left' ? <ArrowLeftIcon /> : <ArrowRightIcon />
        }
        enableSwipeMonths
        dayComponent={({ date, state, marking, theme, onPress }) => (
          <CustomDay
            date={date}
            state={state}
            marking={marking}
            theme={theme}
            onPress={onPress}
          />
        )}
        {...rest}
      />
    </CalendarContainer>
  )
}

const CalendarContainer = styled.View`
  border-radius: 16px;
  overflow: hidden;
`

export default Calendar
