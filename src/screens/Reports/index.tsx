import { StyleSheet, View } from 'react-native'
import { AppHeader } from '@/components'
import { useContext } from 'react'
import { UserDataContext } from '@/contexts/UserDataContext'
import EmployeeReports from './EmployeeReports'
import EmployerReports from './EmployerReports'

const Reports = ({ navigation }: any) => {
  const isEmployer = useContext(UserDataContext).getRole() === 'employer'
  return (
    <View style={styles.container}>
      <AppHeader text="Reports" navigation={navigation} />
      {isEmployer ? <EmployerReports /> : <EmployeeReports />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Reports
