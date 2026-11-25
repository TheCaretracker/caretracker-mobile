import { useCallback, useState } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import moment from 'moment'
import {
  BackButtonHeader,
  TimeSheetCard,
  ButtonWithIcon,
  TimesheetFilter,
  Button,
} from '@/components'
import { FilterIcon } from '@/assets/icons/icon'
import { useFocusEffect } from '@react-navigation/native'
import {
  getTimesheetOptions,
  listTimesheet,
} from '@/requests/timesheetRequests'
import SkeletonLoader from '@/components/Skeleton/SkeletonLoader'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { countFilters } from '@/utils/filters'

type Option = {
  label: string
  value: string
}

interface FilterCounterProps {
  count: number | null
}

interface TimeSheetItem {
  date: string
  name: string
  clockIn: string
  clockOut: string
  totalTime: string
}

const FilterCounter = ({ count }: FilterCounterProps) => {
  return (
    <Counter>
      <CounterText>{count}</CounterText>
    </Counter>
  )
}

const TimeSheetScreen = ({ navigation }: any) => {
  const [data, setData] = useState()
  const [filters, setFilters] = useState<Record<string, any>>({})

  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [employmentUsers, setEmploymentUsers] = useState([])
  const [triggerRefresh, setTriggerRefresh] = useState<boolean>()

  const onPress = () => {
    setShowFilter(true)
  }

  const forceRefresh = () => {
    setTriggerRefresh((previous) => !previous)
  }

  const fetchTimesheet = async () => {
    // Transform filters to match API format
    const apiFilters: Record<string, any> = { ...filters }

    // Handle date range filter
    if (
      filters.dateRange &&
      Array.isArray(filters.dateRange) &&
      filters.dateRange.length === 2
    ) {
      apiFilters.start_date = filters.dateRange[0]
      apiFilters.end_date = filters.dateRange[1]
      delete apiFilters.dateRange
    }

    const { data } = await listTimesheet({ filters: apiFilters })
    if (data.success) {
      setData(data.timesheet)
    }
  }

  const fetchEmploymentUsers = async () => {
    const { data } = await getTimesheetOptions()
    if (data.success) {
      const names = data.users.map(({ id, fullName }) => ({
        value: id,
        label: fullName,
      }))
      setEmploymentUsers(names)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTimesheet()
    }, [filters, triggerRefresh])
  )
  useFocusEffect(
    useCallback(() => {
      fetchEmploymentUsers()
    }, [])
  )

  const filterCount = countFilters(filters)

  const renderData = () => {
    return (
      <SkeletonLoader
        renderSkeleton={() => (
          <>
            <Skeleton width="35%" height={20} />
            <Skeleton width="90%" height={72} />
            <Skeleton width="90%" height={72} />
            <Skeleton width="90%" height={72} />
            <Skeleton width="35%" height={20} />
            <Skeleton width="90%" height={72} />
            <Skeleton width="90%" height={72} />
          </>
        )}
        renderContent={() =>
          Object.entries(data).map(([date, events]) => (
            <View key={date} style={styles.section}>
              <DateTitle>{moment(date).format('MMMM D, YYYY')}</DateTitle>
              {events.map((item, index) => (
                <View key={index}>
                  <TimeSheetCard
                    event={item}
                    eventId={item.id}
                    name={item.name}
                    clockIn={item.clockIn}
                    clockOut={item.clockOut}
                    totalTime={item.totalTime}
                    status={item?.status}
                    forceRefresh={forceRefresh}
                  />
                </View>
              ))}
            </View>
          ))
        }
        isReady={data}
      />
    )
  }

  return (
    <View style={styles.container}>
      <BackButtonHeader header="Timesheet" navigation={navigation} />
      <View style={{ height: 45 }}>
        <ButtonWithIcon
          text="Filter By"
          onPress={onPress}
          count={filterCount ? <FilterCounter count={filterCount} /> : null}
          icon={<FilterIcon />}
          buttonStyle={[styles.filterButton, { width: filterCount ? 122 : 92 }]}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Button
          text="Add new record"
          onPress={() => navigation.navigate('TimeSheetAddEdit')}
        />

        {renderData()}
      </ScrollView>
      <TimesheetFilter
        isVisible={showFilter}
        setIsVisible={() => setShowFilter(false)}
        onApplyFilters={(filters) => {
          setFilters(filters)
        }}
        subjects={employmentUsers}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    alignItems: 'center',
    rowGap: 32,
    paddingBottom: 32,
  },
  section: {
    rowGap: 16,
  },
  filterButton: {
    width: 92,
    marginBottom: -16,
    marginRight: '5%',
    alignSelf: 'flex-end',
  },
})

export default TimeSheetScreen

const DateTitle = styled.Text`
  font-family: 'Outfit-SemiBold';
  color: #375064;
  font-size: 18px;
  margin-left: 5px;
`
const Counter = styled.View`
  width: 21px;
  height: 21px;
  border-radius: 21px;
  justify-content: center;
  align-items: center;
  background-color: #4440d6;
`
const CounterText = styled.Text`
  font-family: 'Outfit-SemiBold';
  font-size: 12px;
  text-align: center;
  color: white;
`
