import { Role } from '@/contexts/UserDataContext'
import { formatHourRange } from '@/utils/date'
import moment from 'moment'
import { View, Text, StyleSheet } from 'react-native'

interface TimeOff {
  name: string
  startDate: string
  startTime: string
  endTime: string
}
interface NextTimeOutProps {
  data: TimeOff[]
  userType?: string
}

const NextTimeOut = ({ data, userType }: NextTimeOutProps) => {
  return (
    <View style={styles.viewBox}>
      <View style={styles.inlineRow}>
        <Text style={styles.cardTitle}>
          {userType === Role.Employee
            ? 'Next Time Out'
            : 'Next Time Off Requests'}
        </Text>
        <Text style={[styles.cardText, { fontSize: 18 }]}>({data.length})</Text>
      </View>
      <View>
        {data.map((item, index) => (
          <View
            key={index}
            style={[styles.row, data.length - 1 === index && styles.lastItem]}
          >
            {userType !== Role.Employee && (
              <View style={{ maxWidth: 100 }}>
                <Text style={styles.cardText}>{item.name}</Text>
              </View>
            )}
            <Text style={styles.cardText}>
              {moment.utc(item.startDate).format('MMMM D, YYYY')}
            </Text>
            <Text style={styles.cardText}>
              {formatHourRange(item.startTime, item.endTime)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBox: {
    flexDirection: 'column',
    width: '90%',
    rowGap: 24,
    padding: 5,
  },
  cardTitle: {
    fontFamily: 'Outfit-SemiBold',
    color: '#375064',
    fontSize: 18,
  },
  cardText: {
    fontFamily: 'Outfit-Regular',
    color: '#6d767c',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dcdedf',
    flex: 1,
    maxWidth: '100%',
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 23,
    columnGap: 8,
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
})

export default NextTimeOut
