import { StyleSheet, ScrollView } from 'react-native'
import UserReport from './User/UserReport'

const EmployeeReports = () => {
  return (
    // marginTop lives on the ScrollView itself (as on Dashboard/Notification)
    // so the scroll view doesn't cover the absolute AppHeader and swallow
    // taps on the notification bell.
    <ScrollView style={styles.content} contentContainerStyle={styles.wrapper}>
      <UserReport />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    marginTop: '30%',
  },
  wrapper: {
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 24,
    marginHorizontal: '5%',
  },
})

export default EmployeeReports
