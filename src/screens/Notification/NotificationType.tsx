import { CrossIcon } from '@/assets/icons/icon'
import globalStyles from '@/globalStyles'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import NotificationButton from './NotificationButton'
import moment from 'moment'
import { useContext } from 'react'
import { UserDataContext } from '@/contexts/UserDataContext'
import { combineDateTime } from '@/utils/date'

export const ScheduleComponent = ({
  notification,
  description,
  inapp,
  setScheduleModal,
}: any) => {
  const data = notification?.data
  return (
    <View style={{ gap: 6, width: inapp ? '90%' : '100%' }}>
      <Text
        style={[globalStyles.bodyTextRegular, styles.title, styles.textColor]}
      >
        <Text style={globalStyles.bodyTextBold}>{data.name} </Text>
        <Text>{description}</Text>
      </Text>
      {!inapp && (
        <>
          <View>
            <Text
              style={[
                globalStyles.bodyTextBold,
                styles.title,
                styles.textColor,
              ]}
            >
              {moment(data.date ?? data.startDate).format('MMMM DD')} |{' '}
              {moment(combineDateTime(data.startTime)).format('hh:mm a')} -{' '}
              {moment(combineDateTime(data.endTime)).format('hh:mm a')}
            </Text>
            {data.endDate && (
              <Text
                style={[
                  globalStyles.bodyTextBold,
                  styles.title,
                  styles.textColor,
                ]}
              >
                EndDate: {moment(data.endDate).format('MMMM DD')}
              </Text>
            )}
          </View>
          {setScheduleModal && (
            <NotificationButton
              setConfirmationModal={(attrs) => {
                setScheduleModal({
                  id:
                    notification.data.recurringEventId ||
                    notification.data.requestId,
                  ...attrs,
                })
              }}
            />
          )}
        </>
      )}
    </View>
  )
}

export const ReportComponent = ({ openRightAction }) => {
  const { isEmployer } = useContext(UserDataContext)
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ maxWidth: '80%', flexGrow: 1 }}>
        <Text
          style={[globalStyles.bodyTextRegular, styles.title, styles.textColor]}
        >
          <Text style={[globalStyles.bodyTextBold]}>Pay period ending. </Text>
          {isEmployer
            ? 'Remember your employee to submit their hours'
            : "Don't forget to submit your hours."}
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={openRightAction}>
          <CrossIcon />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const EmployeeEmployerComponent = ({
  notification,
  description,
  setInviteModal,
}: any) => {
  const data = notification?.data

  return (
    <>
      <Text
        style={[globalStyles.bodyTextRegular, styles.title, styles.textColor]}
      >
        <Text style={[globalStyles.bodyTextBold]}>{data.name}</Text>
        {description}
      </Text>
      <View>
        {setInviteModal && (
          <NotificationButton
            setConfirmationModal={(attrs) => {
              setInviteModal({
                id: data.employmentLinkId,
                ...attrs,
              })
            }}
          />
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
  },
  textColor: {
    color: '#375064',
  },
})
