import globalStyles from '@/globalStyles'
import { RecurringEvent } from '@/types/schedule'
import Colors from '@/utils/colors'
import moment from 'moment'
import { StyleSheet, Text, View } from 'react-native'
import { repeatString } from '@/utils/repeat'

interface RecurringEventCardProps {
  data: RecurringEvent
  title?: string
  showPending?: boolean
}
const RecurringEventCard = ({
  data,
  title,
  showPending = true,
}: RecurringEventCardProps) => {
  const renderDate = () => {
    if (data.endDate) {
      return `${moment(data.startDate).format('MMMM DD')} - ${moment(
        data.endDate
      ).format('MMMM DD')}`
    }

    return moment(data.startDate).format('MMMM DD, YYYY')
  }

  return (
    <View style={styles.contactListWrapper}>
      {title && (
        <Text style={[globalStyles.bodyTextBold, { color: Colors.DarkBlue }]}>
          {title}
        </Text>
      )}
      <View style={[{ marginTop: 16, marginBottom: 8 }]}>
        <Text style={[globalStyles.bodyTextBold, { color: Colors.DarkBlue }]}>
          {renderDate()}
        </Text>
        <View style={[styles.avatarWrapper]}>
          <Text style={styles.timeText}>
            {[
              moment.utc(data.startTime).local().format('hh:mm A'),
              moment.utc(data.endTime).local().format('hh:mm A'),
            ].join(' - ')}
          </Text>
          {showPending && data.status === 'pending' && (
            <Text style={styles.pendingText}>{'Pending Acceptance'}</Text>
          )}
        </View>
      </View>
      {data.repeat && (
        <Text style={styles.repeatText}>{repeatString(data)}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contactListWrapper: {
    backgroundColor: 'white',
    marginBottom: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    rowGap: 4,
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Outfit-Regular',
    color: Colors.DarkBlue,
    fontSize: 14,
  },
  repeatText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkBlue,
  },
  pendingText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: Colors.DarkGrey,
  },
})

export default RecurringEventCard
