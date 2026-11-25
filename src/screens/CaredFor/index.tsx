import { useState, useContext, useEffect, useCallback } from 'react'
import styled from 'styled-components/native'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  FlatList,
} from 'react-native'
import { AppHeader, ButtonWithIcon, Card } from '@/components'
import { FilterIcon, PlusIcon } from '@/assets/icons/icon'
import { Role, UserDataContext } from '@/contexts/UserDataContext'
import { listCaredFor } from '@/requests/caredForRequests'
import CaredForCard from '@/components/CaredFor/CaredForCard'
import { CaredForSmall } from '@/types/caredFor'
import { CaredForContext } from '@/contexts/CaredForContext'
import { SkeletonCard } from '@/components/Skeleton/SkeletonCard'
import { serializeQuery } from '@/utils/params'
import { useFocusEffect } from '@react-navigation/native'
import CaredForFilter from '@/components/Filter/CaredForFilter'
import { Skeleton } from '@/components/Skeleton/Skeleton'

type Option = {
  label: string
  value: string
}

const isAndroid = Platform.OS === 'android'

const FilterCounter = ({ count }: { count: number | null }) => {
  return (
    <Counter>
      <CounterText>{count}</CounterText>
    </Counter>
  )
}

const CaredFor = ({ navigation, route }: any) => {
  const { triggerRefresh, setTriggerRefresh } = useContext(CaredForContext)

  const [data, setData] = useState<CaredForSmall[]>([])
  const [filters, setFilters] = useState({})
  // we need to use state to store the employers because the
  // date changes when a filter is applied,
  // so we need a list of employees when data is first loaded from db
  const [employees, setEmployees] = useState([])
  const { getRole } = useContext(UserDataContext)
  const onPress = (id: number) => {
    navigation.navigate('CaredForDetailScreen', { childId: id })
  }

  const [isReady, setIsReady] = useState(false)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const onPressFilter = () => {
    setShowFilter(true)
  }

  const fetchCaredFor = async () => {
    setIsReady(false)

    const { data } = await listCaredFor({ filters })
    if (data.success) {
      setData(data.carees)

      if (!employees.length) {
        const uniqueEmployeesId = new Set(
          data.carees.map((item) => item.guardianId)
        )
        const employeesList = [...uniqueEmployeesId].map((id) => {
          const employee = data.carees.find((data) => data.guardianId === id)
          return {
            label: employee.guardianName,
            value: employee.guardianId,
          }
        })
        setEmployees(employeesList)
      }
    }
    setIsReady(true)
  }

  useFocusEffect(
    useCallback(() => {
      fetchCaredFor()
    }, [triggerRefresh, filters])
  )

  return (
    <View style={styles.container}>
      <AppHeader text="The Cared For" navigation={navigation} />
      {getRole() === Role.Employee ? (
        <View style={styles.header}>
          <ButtonWithIcon
            text="Filter By"
            onPress={() => onPressFilter()}
            icon={<FilterIcon />}
            count={
              Object.keys(filters).length ? (
                <FilterCounter count={Object.keys(filters).length} />
              ) : null
            }
            buttonStyle={{ width: Object.keys(filters).length ? 122 : 92 }}
          />
        </View>
      ) : null}

      {isReady ? (
        <ScrollView
          contentContainerStyle={styles.wrapper}
          style={[
            styles.content,
            { marginTop: getRole() === 'employer' ? 120 : 16 },
          ]}
        >
          {data.map((child: CaredForSmall, index) => (
            <CaredForCard
              key={index}
              onPress={() => onPress(child.id)}
              childData={child}
            />
          ))}
          {getRole() === 'employer' && <View style={{ height: 60 }} />}
        </ScrollView>
      ) : (
        // Showing skeleton loaders initially
        <FlatList
          style={{
            width: '100%',
            paddingHorizontal: 20,
            marginTop: getRole() === 'employer' ? 120 : 16,
            zIndex: 2,
          }}
          data={Array.from({ length: 6 })}
          renderItem={() => <Skeleton width="100%" height={88} />}
        />
      )}
      {getRole() === 'employer' ? (
        <PlusButton
          onPress={() => {
            navigation.navigate('NewCaredFor')
          }}
        >
          <PlusIcon width={29} height={29} />
        </PlusButton>
      ) : null}
      <CaredForFilter
        isVisible={showFilter}
        setIsVisible={() => setShowFilter(false)}
        employees={employees}
        onApplyFilters={(filters) => setFilters(filters)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: isAndroid ? 84 : 96,
    alignItems: 'flex-end',
    width: '95%',
  },
  content: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  wrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingBottom: 20,
  },
})

export default CaredFor

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
const PlusButton = styled.TouchableOpacity`
  background-color: #ded2ff;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 999;
`
