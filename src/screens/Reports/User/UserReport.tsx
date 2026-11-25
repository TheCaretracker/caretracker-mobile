import { HoursCharts, TotalHourBlueCard } from '@/components'
import { getFormattedDate } from '../helper'
import { useCallback, useContext, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import moment from 'moment'
import CalendarReport from '../Calendar/CalendarReport'
import { fetchHoursByDateRange } from '@/requests/reportRequests'
import { UserDataContext } from '@/contexts/UserDataContext'

type UserReportProps = {
  name?: string
  id?: number
}

const UserReport = ({ name, id }: UserReportProps) => {
  const [periodType, setPeriodType] = useState<
    'thisWeek' | 'dateRange' | 'allTime'
  >('allTime')
  // Persistent applied date range
  const [startDate, setStartDate] = useState(
    moment('2024-01-01').format('YYYY-MM-DD')
  )
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
  // Temporary selection used while Date Range modal is open (supports clear & cancel)
  const [tempStartDate, setTempStartDate] = useState<string | null>(null)
  const [tempEndDate, setTempEndDate] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // const [hoursData, setHoursData] = useState([])
  // const [yearToDate, setYearToDate] = useState<number>(0.0)
  // const [PTOSickTime, setPTOSickTime] = useState<number>(0.0)
  const [totalHours, setTotalHours] = useState<number>(0.0)

  const { isEmployer } = useContext(UserDataContext)

  const onPressDone = () => {
    setIsModalVisible(false)
    // If both dates selected apply them, otherwise treat as cleared (revert to all time)
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate)
      setEndDate(tempEndDate)
      fetchHours(tempStartDate, tempEndDate)
    } else {
      setPeriodType('allTime')
      fetchAllTime()
    }
    // Reset temps after decision
    setTempStartDate(null)
    setTempEndDate(null)
  }

  // const getYTD_PTO_sickTime = async (userId?: number) => {
  //   if (!userId) return
  //   const { data } = await fetchHoursYearToDate(userId)
  //   setYearToDate(data.hoursYearToDate.toFixed(2))
  //   setPTOSickTime(data.ptoHoursYearToDate)
  // }

  // const getHoursForDateRange = async (
  //   startDate: string,
  //   endDate: string,
  //   isRange: boolean,
  //   userId?: number
  // ) => {
  //   if (!userId) return

  //   let result = await fetchHoursForDateRange({
  //     start_date: startDate,
  //     end_date: endDate,
  //     is_range: isRange,
  //     user_id: userId,
  //   })

  //   setHoursData(result.data.rangeHours)
  // }

  const fetchHours = useCallback(
    async (start: string, end: string) => {
      setLoading(true)
      try {
        const userIdParam = isEmployer ? { employee_id: id } : {}
        const result = await fetchHoursByDateRange({
          start_date: start,
          end_date: end,
          ...userIdParam,
        })
        setTotalHours(result.data.totalHours.toFixed(2))
      } catch (error) {
        console.error('Error fetching hours:', error)
      } finally {
        setLoading(false)
      }
    },
    [id, isEmployer]
  )

  const fetchThisWeek = useCallback(() => {
    const start = moment().startOf('week').add(1, 'day').format('YYYY-MM-DD') // Start from Monday
    const end = moment().format('YYYY-MM-DD') // Current day
    setStartDate(start)
    setEndDate(end)
    fetchHours(start, end)
  }, [id, fetchHours])

  const fetchAllTime = useCallback(() => {
    const start = moment('2024-01-01').format('YYYY-MM-DD')
    const end = moment().format('YYYY-MM-DD')
    setStartDate(start)
    setEndDate(end)
    fetchHours(start, end)
  }, [id, fetchHours])

  useEffect(() => {
    if (periodType === 'dateRange') {
      return
    }
    if (periodType === 'thisWeek') {
      fetchThisWeek()
      return
    }
    if (periodType === 'allTime') {
      fetchAllTime()
      return
    }
  }, [periodType, fetchAllTime, fetchThisWeek])

  const timeDetails =
    periodType === 'dateRange'
      ? `${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}`
      : periodType === 'thisWeek'
        ? 'This Week'
        : 'All time'

  return (
    <>
      <HoursCharts
        key={name}
        title="Pay Period"
        label={name}
        startDate={getFormattedDate(startDate)}
        endDate={getFormattedDate(endDate)}
        hasButtons
        onPressDateRange={() => {
          // Initialize temp range with currently applied range for editing
          setTempStartDate(startDate)
          setTempEndDate(endDate)
          setIsModalVisible(true)
          setPeriodType('dateRange')
        }}
        onPressThisWeek={() => {
          setIsModalVisible(false)
          setPeriodType('thisWeek')
        }}
        onPressAllTime={() => {
          setIsModalVisible(false)
          setPeriodType('allTime')
        }}
        periodType={periodType}
      >
        <View style={styles.row}>
          <TotalHourBlueCard
            title={'Total Hours'}
            hour={totalHours.toLocaleString()}
            smallLabel={timeDetails}
            loading={loading}
          />
          {/* <TotalHourBlueCard
            title={'Year to Date'}
            hour={yearToDate.toLocaleString()}
            smallLabel={'Hours approved'}
          />
          <TotalHourBlueCard
            title={'PTO / Sick Time'}
            hour={PTOSickTime.toLocaleString()}
            smallLabel={'Hours'}
          /> */}
        </View>
      </HoursCharts>
      <CalendarReport
        isModalVisible={isModalVisible}
        setIsModalVisible={(visible) => {
          // Cancel: close & discard temp changes
          if (!visible) {
            setTempStartDate(null)
            setTempEndDate(null)
          }
          setIsModalVisible(visible)
        }}
        startDate={tempStartDate}
        endDate={tempEndDate}
        onPressDone={onPressDone}
        onChangeRange={(start, end) => {
          // Update only temporary values; persistent applied on Done
          setTempStartDate(start)
          setTempEndDate(end)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
  },
})

export default UserReport
