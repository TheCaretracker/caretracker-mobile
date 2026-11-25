import { useCallback, useContext, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import {
  AppHeader,
  TotalHourCard,
  HoursCharts,
  YourScheduleCard,
} from '@/components'
import { todayData } from './mockData'
// import NextTimeOut from './NextTimeOut'
import { Role, UserDataContext } from '@/contexts/UserDataContext'
import { useFocusEffect } from '@react-navigation/native'
import { listWeekHours, listWorkEvents } from '@/requests/workEventsRequests'

const Dashboard = ({ navigation }: any) => {
  // const [showNotification, setShowNotification] = useState(true)

  const { getRole, userData } = useContext(UserDataContext)
  const [data, setData] = useState(
    userData.id == 2 ? todayData : [todayData[0]]
  ) // for now only displayed data for employee_0: Remaining Integration

  const isEmployee = getRole() === Role.Employee
  // const [nextTimeOff, setNextTimeOff] = useState([])
  const [hoursThisWeek, setHoursThisWeek] = useState<string>()
  const [hoursWholeWeekData, setHoursWholeWeekData] = useState<any[]>([])

  const handleIsOutChange = (id: number) => {
    const updatedTodayData = [...data]
    updatedTodayData[id].isOut = !updatedTodayData[id].isOut
    setData(updatedTodayData)
  }

  const fetchTimeOffData = async () => {
    // Fetch next time off data/requests based on user's role
    const { data } = await listWeekHours()
    if (data.success) {
      // processTimeOffData(data.timeOff)
      processHoursThisWeekData(data.hoursThisWeek)
    }
  }

  const processHoursThisWeekData = (data: any[]) => {
    // Calculate and set total hours
    let totalHours = 0
    data.forEach((obj, index) => {
      totalHours += obj.value
    })
    setHoursThisWeek(totalHours.toFixed(2))

    // Set individual day hours
    setHoursWholeWeekData(
      data.map((item) => ({
        ...item,
        value: Number(item.value.toFixed(2)),
      }))
    )
  }

  // const processTimeOffData = (timeOffData: any[]) => {
  //   const formattedTimeOffData = timeOffData.map((timeOff) => {
  //     return {
  //       name: timeOff.employeeName,
  //       startTime: timeOff.startTime,
  //       startDate: timeOff.startDate,
  //       endTime: timeOff.endTime,
  //     }
  //   })

  //   setNextTimeOff(formattedTimeOffData)
  // }

  useFocusEffect(
    useCallback(() => {
      fetchTimeOffData()
    }, [])
  )

  return (
    <View style={styles.container}>
      <AppHeader
        text={userData?.fullName || ''}
        centerText={false}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.wrapper} style={styles.content}>
        <YourScheduleCard
          toggleIsOut={handleIsOutChange}
          userType={getRole()}
          navigation={navigation}
        />
        {isEmployee ? <TotalHourCard total={hoursThisWeek} /> : null}
        <HoursCharts
          showChart
          title={isEmployee ? 'Hours overview' : 'Hours requested overview'}
          data={hoursWholeWeekData}
          onPress={() => navigation.navigate('TimeSheetScreen')}
          periodType="thisWeek"
        />
        {/* <NextTimeOut userType={getRole()} data={nextTimeOff} /> */}
        <View />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: 120,
  },
  wrapper: {
    alignItems: 'center',
    rowGap: 32,
    paddingHorizontal: '5%',
  },
})

export default Dashboard
