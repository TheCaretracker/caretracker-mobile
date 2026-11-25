import { fetchHoursForDateRange } from '@/requests/reportRequests'
import moment from 'moment'
import dayjs from 'dayjs'

export const handleDayPress = (
  day,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  setMarkedDates
) => {
  const selectedDateString = day.dateString
  if (!rangeStart) {
    setRangeStart(selectedDateString)
  } else {
    const startDate = new Date(rangeStart)
    const endDate = new Date(rangeEnd)
    const selectedDate = new Date(selectedDateString)
    if (selectedDate < startDate) {
      setRangeStart(selectedDateString)
      updateMarkedDates(selectedDateString, rangeEnd, setMarkedDates)
    } else if (selectedDate > endDate) {
      setRangeEnd(selectedDateString)
      updateMarkedDates(rangeStart, selectedDateString, setMarkedDates)
    }
  }
}

export const updateMarkedDates = (start, end, setMarkedDates) => {
  const updatedMarkedDates = {}
  const range = generateDateRange(start, end)

  range.forEach((date) => {
    updatedMarkedDates[date] = {
      color: '#e4efff',
    }

    if (date === start || date === end) {
      const updatedDate = updatedMarkedDates[date]
      updatedDate.startingDay = date === start
      updatedDate.endingDay = date === end
      updatedDate.color = '#bbd6f4'
      updatedDate.textColor = '#007bff'
    }
  })

  setMarkedDates(updatedMarkedDates)
}

export const generateDateRange = (startDate, endDate) => {
  const range = []
  let currentDate = new Date(startDate)

  while (currentDate <= new Date(endDate)) {
    range.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return range
}

export const closeCalendarModal = (
  rangeDateData,
  setRangeStart,
  setRangeEnd,
  setMarkedDates,
  setIsModalVisible,
  setIsYearSelectVisible,
  isLastWeekActive,
  setLastWeekActive
) => {
  if (rangeDateData?.length === 0 || rangeDateData == undefined) {
    setIsModalVisible(false)
    setIsYearSelectVisible(false)
    setLastWeekActive?.(!isLastWeekActive)
    return
  }
  let prevRangeStart = null
  let prevRangeEnd = null

  if (rangeDateData?.length > 0) {
    const lastIndex = rangeDateData?.length - 1
    prevRangeStart = rangeDateData[0].date
    prevRangeEnd = rangeDateData[lastIndex].date
  }
  setRangeStart(prevRangeStart)
  setRangeEnd(prevRangeEnd)
  updateMarkedDates(prevRangeStart, prevRangeEnd, setMarkedDates)
  setIsModalVisible(false)
  setIsYearSelectVisible(false)
  setLastWeekActive?.(!isLastWeekActive)
}

export const getRangeData = async (
  is_range: boolean = false,
  rangeStart,
  rangeEnd,
  setRangeDateData,
  setHoursData,
  setIsModalVisible,
  setIsYearSelectVisible,
  setIsLoading
) => {
  if (!rangeStart || !rangeEnd) {
    setRangeDateData()
    setIsModalVisible(false)
    setIsYearSelectVisible(false)
    return
  }

  if (rangeStart == rangeEnd) {
    rangeEnd = moment(rangeEnd).add(1, 'days').format('YYYY-MM-DD')
  }
  setIsLoading(true)
  const startDate = new Date(rangeStart)
  const endDate = new Date(rangeEnd)

  const { data } = await fetchHoursForDateRange({
    start_date: startDate,
    end_date: endDate,
    is_range: is_range,
  })
  if (data.success) {
    if (is_range) {
      setRangeDateData(data.rangeHours)
    } else {
      setHoursData(data.rangeHours)
    }
  } else {
    console.log('ERROR! Fetching date range data')
  }
  setIsLoading(false)
  setIsModalVisible(false)
  setIsYearSelectVisible(false)
}

export const clearRangeData = (setRangeStart, setRangeEnd, setMarkedDates) => {
  setRangeStart(null)
  setRangeEnd(null)
  setMarkedDates({})
}

export const getFormattedDate = (dateString) => {
  return dateString
    ? moment(dateString, 'YYYY-MM-DD').format('MMM D, YYYY')
    : ''
}

export const getYears = (setYearsArr) => {
  const yearsAheadOfTime = 1
  const yearsBeforeTime = 20
  setYearsArr([]) //Resetting previous value

  for (
    let i = dayjs().year() + yearsAheadOfTime;
    i > dayjs().year() - yearsBeforeTime;
    i--
  ) {
    setYearsArr((prev) => [...prev, i])
  }
}
