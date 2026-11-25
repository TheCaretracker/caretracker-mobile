import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import Colors from '@/utils/colors'
import CalendarReport from '@/screens/Reports/Calendar/CalendarReport'
import moment from 'moment'

interface DateRangeSelectorProps {
  title: string
  startDate: string | null
  endDate: string | null
  onChangeRange: (start: string | null, end: string | null) => void
}

const DateRangeSelector = ({
  title,
  startDate,
  endDate,
  onChangeRange,
}: DateRangeSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  // temp values for in-modal selection; do not mutate parent until Done
  const [tempStartDate, setTempStartDate] = useState<string | null>(null)
  const [tempEndDate, setTempEndDate] = useState<string | null>(null)

  const hasDateRange = (startDate && endDate) || (tempStartDate && tempEndDate)

  const dateRangeText = hasDateRange
    ? `${moment(startDate).format('MMM D, YYYY')} - ${moment(endDate).format('MMM D, YYYY')}`
    : 'Select date range'

  const handleDone = () => {
    // Apply temp values to parent
    onChangeRange(tempStartDate, tempEndDate)
    setIsModalVisible(false)
    // Reset temps after applying
    setTempStartDate(null)
    setTempEndDate(null)
  }

  // Open modal: initialize temp range from current props
  const openModal = () => {
    setTempStartDate(startDate)
    setTempEndDate(endDate)
    setIsModalVisible(true)
  }

  return (
    <>
      <Container>
        <Title>{title}</Title>
        <TouchableOpacity style={styles.dateButton} onPress={openModal}>
          <DateText hasValue={!!hasDateRange}>{dateRangeText}</DateText>
        </TouchableOpacity>
      </Container>

      <CalendarReport
        isModalVisible={isModalVisible}
        setIsModalVisible={(visible) => {
          if (!visible) {
            // Cancel: just close and discard temp selection
            setTempStartDate(null)
            setTempEndDate(null)
          }
          setIsModalVisible(visible)
        }}
        startDate={tempStartDate}
        endDate={tempEndDate}
        onChangeRange={(start, end) => {
          setTempStartDate(start)
          setTempEndDate(end)
        }}
        onPressDone={handleDone}
      />
    </>
  )
}

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
})

const Container = styled.View`
  width: 100%;
`

const Title = styled.Text`
  font-family: 'Outfit-SemiBold';
  font-size: 16px;
  color: ${Colors.DarkBlue};
`

const DateText = styled.Text<{ hasValue: boolean }>`
  font-family: 'Outfit-Regular';
  font-size: 16px;
  color: ${(props) => (props.hasValue ? Colors.BlackText : Colors.DarkGrey)};
`

export default DateRangeSelector
