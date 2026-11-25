import { StyleSheet, ScrollView, View } from 'react-native'
import { useState, useEffect } from 'react'
import { fetchEmployees as getEmployees } from '@/requests/reportRequests'
import UserReport from './User/UserReport'
import { ButtonWithIcon } from '@/components'
import { FilterIcon } from '@/assets/icons/icon'
import ReportEmployerFilter from '@/components/Filter/ReportEmployerFilter'
import FilterCounter from './Filter/FilterReport'

type Employee = {
  id: number
  name: string
}

const EmployerReports = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filterApplied, setFilterApplied] = useState<number | null>(null)

  const employeesFiltered = employees.filter((employee) =>
    activeFilters.includes(employee.name)
  )

  const fetchEmployees = async () => {
    try {
      const { data } = await getEmployees()
      const allEmployees: { id: number; name: string }[] = data.employments.map(
        (emp: { employee: { id: number; fullName: string } }) => ({
          id: emp.employee.id,
          name: emp.employee.fullName,
        })
      )

      setEmployees(allEmployees)
      setActiveFilters(allEmployees.map((emp) => emp.name))
      setFilterApplied(allEmployees.length)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return (
    <>
      <View style={styles.filterWrapper}>
        <ButtonWithIcon
          text="Filter By"
          onPress={() => setShowFilter(true)}
          icon={<FilterIcon />}
          count={filterApplied && <FilterCounter count={filterApplied} />}
          buttonStyle={{ width: filterApplied ? 122 : 92 }}
        />
      </View>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {filterApplied !== null ? (
          employeesFiltered.map((employee: any, index) => (
            <UserReport
              key={employee.id}
              id={employee.id}
              name={employee.name}
            />
          ))
        ) : (
          <UserReport />
        )}
      </ScrollView>
      <ReportEmployerFilter
        filterData={employees}
        isVisible={showFilter}
        setIsVisible={() => setShowFilter(false)}
        onApplyFilters={(filters) => {
          setActiveFilters(filters.map((f) => f.value))
          setFilterApplied(filters.length || null)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  filterWrapper: {
    marginHorizontal: '5%',
    marginTop: 96,
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  wrapper: {
    flexGrow: 1,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 24,
    marginHorizontal: '5%',
  },
})

export default EmployerReports
