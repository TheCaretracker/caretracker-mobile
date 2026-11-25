import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import globalStyles from '@/globalStyles'
import {
  BookIcon,
  CrossIcon,
  GraphOutline,
  Heart,
  RedEllipse,
  RoundCalendar,
  WhiteStar,
} from '@/assets/icons/icon'
import { memo, useRef } from 'react'
import NotificationHeader from './NotificationHeader'
import IconContainer from './IconContainer'
import TextComponent from '../../components/Card/TextComponent'
import {
  EmployeeEmployerComponent,
  ReportComponent,
  ScheduleComponent,
} from './NotificationType'
import { InAppNotificationHeader } from './InAppNotification'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'
import { NotificationTypeEnum } from './NotificationTypeEnum'
import Avatar from '../../components/Avatar/Avatar'
import moment from 'moment'
import { timesheetChangesDescription } from './helper'
import { combineDateTime } from '@/utils/date'

const Notificationpage = memo(
  ({
    notification,
    inapp,
    handleRemoveNotification,
    setScheduleModal,
    setInviteModal,
    setTimeRecordModal,
    handleDelete,
    hasMarginBottom = false,
  }: any) => {
    const data = notification?.data
    let HeaderComponent: any
    let ImageComponent: any
    let BodyComponent: any

    const swipeableRef = useRef(null)

    const openRightAction = () => {
      if (swipeableRef.current) {
        swipeableRef.current.openRight()
      }
    }

    const closeSwipeable = () => {
      if (swipeableRef.current) {
        swipeableRef.current.reset()
      }
    }

    switch (data?.type) {
      case NotificationTypeEnum.ScheduleRequest:
      case NotificationTypeEnum.ScheduleChangeRequest: {
        const inappMessageMapper = {
          [NotificationTypeEnum.ScheduleRequest]:
            'has requested a new schedule',
          [NotificationTypeEnum.ScheduleChangeRequest]:
            'has requested a schedule change',
        }
        const messageMapper = {
          [NotificationTypeEnum.ScheduleRequest]:
            'has requested a schedule for',
          [NotificationTypeEnum.ScheduleChangeRequest]:
            'has requested a schedule change for',
        }
        HeaderComponent = !inapp ? (
          <NotificationHeader
            headerTitle="Schedule"
            icon={<RoundCalendar width={10} height={10} />}
            isUnread={notification.unRead}
            openRightAction={openRightAction}
          />
        ) : (
          <InAppNotificationHeader
            headerTitle="Schedule"
            icon={<RoundCalendar width={10} height={10} />}
            updatedAt={notification.updatedAt}
            handleRemoveNotification={handleRemoveNotification}
          />
        )
        ImageComponent = (
          <Avatar
            source={data.avatar}
            containerStyle={{ height: 34, width: 34 }}
          />
        )
        BodyComponent = (
          <ScheduleComponent
            notification={notification}
            description={
              inapp
                ? inappMessageMapper[
                    data.type as keyof typeof inappMessageMapper
                  ]
                : messageMapper[data.type as keyof typeof messageMapper]
            }
            inapp={inapp}
            setScheduleModal={setScheduleModal}
          />
        )
        break
      }
      case NotificationTypeEnum.TimeOffReminder:
        ImageComponent = <IconContainer icon={<RoundCalendar />} />
        BodyComponent = (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text
                style={[
                  globalStyles.bodyTextBold,
                  styles.title,
                  styles.textColor,
                ]}
              >
                Tomorrow's your day off —{' '}
              </Text>
              <Text
                style={[
                  globalStyles.bodyTextBold,
                  styles.title,
                  styles.textColor,
                ]}
              >
                rest and recharge!
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {notification.unRead && <RedEllipse />}
              <TouchableOpacity onPress={openRightAction}>
                <CrossIcon />
              </TouchableOpacity>
            </View>
          </View>
        )
        break
      case NotificationTypeEnum.MedicationReminder:
        HeaderComponent = (
          <NotificationHeader
            headerTitle="The Cared For"
            icon={<Heart width={10} height={10} />}
            openRightAction={inapp ? handleRemoveNotification : openRightAction}
          />
        )
        ImageComponent = <IconContainer icon={<BookIcon />} />
        BodyComponent = (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 6 }}>
              <Text
                style={[
                  globalStyles.bodyTextRegular,
                  styles.title,
                  styles.textColor,
                ]}
              >
                It's time for{' '}
                <Text style={globalStyles.bodyTextBold}>
                  {notification.data.name}
                </Text>
                's medication
              </Text>
              <View>
                <Text
                  style={[
                    globalStyles.bodyTextBold,
                    styles.title,
                    styles.textColor,
                  ]}
                >
                  {moment(combineDateTime(notification.data?.time)).format(
                    'hh:mm A'
                  )}
                </Text>
              </View>
            </View>
            <View style={{ gap: 16 }}>
              <View style={styles.lineSeparator} />
              <View style={styles.personalHistoryInfo}>
                <TextComponent
                  title="Name"
                  value={
                    notification.data.medication_name ||
                    notification.data.medicationName
                  }
                  style={{ flexGrow: 1 }}
                />
                <TextComponent title="Dose" value={notification.data.dose} />
              </View>
            </View>
          </View>
        )
        break
      case NotificationTypeEnum.PayPeriodReminder:
        ImageComponent = <IconContainer icon={<GraphOutline />} />
        BodyComponent = <ReportComponent openRightAction={openRightAction} />
        break
      case NotificationTypeEnum.InviteRequest:
        HeaderComponent = (
          <NotificationHeader
            headerTitle="My Employers"
            icon={<WhiteStar width={10} height={10} />}
            openRightAction={inapp ? handleRemoveNotification : openRightAction}
          />
        )
        ImageComponent = (
          <Avatar
            source={data.avatar}
            containerStyle={{ height: 34, width: 34 }}
          />
        )
        BodyComponent = (
          <EmployeeEmployerComponent
            notification={notification}
            description=" has sent you an invite"
            setInviteModal={setInviteModal}
          />
        )
        break

      case NotificationTypeEnum.ScheduleAccept:
      case NotificationTypeEnum.ScheduleChangeAccept:
        HeaderComponent = !inapp ? (
          <NotificationHeader
            headerTitle="Schedule"
            icon={<RoundCalendar width={10} height={10} />}
            isUnread={notification.unRead}
            openRightAction={openRightAction}
          />
        ) : (
          <InAppNotificationHeader
            headerTitle="Schedule"
            icon={<RoundCalendar width={10} height={10} />}
            updatedAt={notification.updatedAt}
            handleRemoveNotification={handleRemoveNotification}
          />
        )
        ImageComponent = (
          <Avatar
            source={data.avatar}
            containerStyle={{ height: 34, width: 34 }}
          />
        )
        BodyComponent = (
          <>
            <ScheduleComponent
              notification={notification}
              description={`has ${notification.data.status} your schedule ${data.type === NotificationTypeEnum.ScheduleChangeAccept ? 'change' : ''} ${
                inapp ? ' ' : 'for'
              }`}
              inapp={inapp}
              setScheduleModal={undefined}
            />
          </>
        )
        break

      case NotificationTypeEnum.InviteAccept:
        HeaderComponent = (
          <NotificationHeader
            headerTitle="My Employees"
            icon={<WhiteStar width={10} height={10} />}
            openRightAction={inapp ? handleRemoveNotification : openRightAction}
          />
        )
        ImageComponent = (
          <Avatar
            source={data.avatar}
            containerStyle={{ height: 34, width: 34 }}
          />
        )
        BodyComponent = (
          <EmployeeEmployerComponent
            notification={notification}
            description=" has accepted your invite and is now in The CareTracker"
          />
        )
        break
      case NotificationTypeEnum.TimeOffNotification:
        ImageComponent = <IconContainer icon={<RoundCalendar />} />
        BodyComponent = (
          <ScheduleComponent
            notification={notification}
            description={
              inapp
                ? 'has requested a time off'
                : 'has requested a time off for'
            }
            inapp={inapp}
          />
        )
        break
      case NotificationTypeEnum.TimeRecordChangeRequest:
        HeaderComponent = !inapp ? (
          <NotificationHeader
            headerTitle="Timesheet"
            icon={<RoundCalendar width={10} height={10} />}
            isUnread={notification.unRead}
            openRightAction={openRightAction}
          />
        ) : (
          <InAppNotificationHeader
            headerTitle="Timesheet"
            icon={<RoundCalendar width={10} height={10} />}
            updatedAt={notification.updatedAt}
            handleRemoveNotification={handleRemoveNotification}
          />
        )
        ImageComponent = (
          <Avatar
            source={data.avatar}
            containerStyle={{ height: 34, width: 34 }}
          />
        )
        BodyComponent = (
          <ScheduleComponent
            notification={notification}
            description={timesheetChangesDescription(notification, inapp)}
            inapp={inapp}
            setScheduleModal={setTimeRecordModal}
          />
        )
        break
      case NotificationTypeEnum.TimeRecordAccept:
        HeaderComponent = !inapp ? (
          <NotificationHeader
            headerTitle="Timesheet"
            icon={<RoundCalendar width={10} height={10} />}
            isUnread={notification.unRead}
            openRightAction={openRightAction}
          />
        ) : (
          <InAppNotificationHeader
            headerTitle="Timesheet"
            icon={<RoundCalendar width={10} height={10} />}
            updatedAt={notification.updatedAt}
            handleRemoveNotification={handleRemoveNotification}
          />
        )
        ImageComponent = (
          <Avatar
            source={data.avatar}
            containerStyle={{ height: 34, width: 34 }}
          />
        )
        BodyComponent = (
          <>
            <ScheduleComponent
              notification={notification}
              description={`has ${notification.data.status} your time record ${
                inapp ? ' ' : 'for'
              }`}
              inapp={inapp}
              setScheduleModal={undefined}
            />
          </>
        )
        break
      case NotificationTypeEnum.CareeChanges:
        HeaderComponent = (
          <NotificationHeader
            headerTitle="The Cared For"
            icon={<Heart width={10} height={10} />}
            openRightAction={inapp ? handleRemoveNotification : openRightAction}
          />
        )
        ImageComponent = <IconContainer icon={<BookIcon />} />
        BodyComponent = (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 6 }}>
              <Text
                style={[
                  globalStyles.bodyTextRegular,
                  styles.title,
                  styles.textColor,
                ]}
              >
                <Text style={globalStyles.bodyTextBold}>
                  {notification.data.name}
                </Text>
                's care list has been updated
              </Text>
              <View>
                <Text
                  style={[
                    globalStyles.bodyTextBold,
                    styles.title,
                    styles.textColor,
                  ]}
                >
                  {moment(notification.createdAt).format('hh:mm A')}
                </Text>
              </View>
            </View>
          </View>
        )
        break
      case NotificationTypeEnum.ActivityReminder:
        HeaderComponent = (
          <NotificationHeader
            headerTitle="The Cared For"
            icon={<Heart width={10} height={10} />}
            openRightAction={inapp ? handleRemoveNotification : openRightAction}
          />
        )
        ImageComponent = <IconContainer icon={<BookIcon />} />
        BodyComponent = (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 6 }}>
              <Text
                style={[
                  globalStyles.bodyTextRegular,
                  styles.title,
                  styles.textColor,
                ]}
              >
                It's time for{' '}
                <Text style={globalStyles.bodyTextBold}>
                  {notification.data.name}
                </Text>
                's activity
              </Text>
              <View>
                <Text
                  style={[
                    globalStyles.bodyTextBold,
                    styles.title,
                    styles.textColor,
                  ]}
                >
                  {moment(combineDateTime(notification.data?.time)).format(
                    'hh:mm A'
                  )}
                </Text>
              </View>
            </View>
            <View style={{ gap: 16 }}>
              <View style={styles.lineSeparator} />
              <View style={styles.personalHistoryInfo}>
                <TextComponent
                  title="Name"
                  value={notification.data.activityName}
                  style={{ flexGrow: 1 }}
                />
              </View>
            </View>
          </View>
        )
        break
      case NotificationTypeEnum.NapTimeReminder:
        HeaderComponent = (
          <NotificationHeader
            headerTitle="Nap Time"
            icon={<Heart width={10} height={10} />}
            openRightAction={inapp ? handleRemoveNotification : openRightAction}
          />
        )
        ImageComponent = <IconContainer icon={<BookIcon />} />
        BodyComponent = (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 6 }}>
              <Text
                style={[
                  globalStyles.bodyTextRegular,
                  styles.title,
                  styles.textColor,
                ]}
              >
                <Text style={globalStyles.bodyTextBold}>
                  {notification.data.name}
                </Text>
                's Nap Time
              </Text>
              <View>
                <Text
                  style={[
                    globalStyles.bodyTextBold,
                    styles.title,
                    styles.textColor,
                  ]}
                >
                  {moment(combineDateTime(notification.data?.time)).format(
                    'hh:mm A'
                  )}
                </Text>
              </View>
            </View>
          </View>
        )
        break
      case NotificationTypeEnum.FeedingTimeReminder:
        HeaderComponent = (
          <NotificationHeader
            headerTitle="Feeding Time"
            icon={<Heart width={10} height={10} />}
            openRightAction={inapp ? handleRemoveNotification : openRightAction}
          />
        )
        ImageComponent = <IconContainer icon={<BookIcon />} />
        BodyComponent = (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 6 }}>
              <Text
                style={[
                  globalStyles.bodyTextRegular,
                  styles.title,
                  styles.textColor,
                ]}
              >
                <Text style={globalStyles.bodyTextBold}>
                  {notification.data.name}
                </Text>
                's Feeding Time
              </Text>
              <View>
                <Text
                  style={[
                    globalStyles.bodyTextBold,
                    styles.title,
                    styles.textColor,
                  ]}
                >
                  {moment(combineDateTime(notification.data?.time)).format(
                    'hh:mm A'
                  )}
                </Text>
              </View>
            </View>
          </View>
        )
        break
      default:
        return <></>
    }

    return (
      <>
        {!inapp ? (
          <GestureHandlerRootView
            style={[
              styles.gestureContainer,
              hasMarginBottom && { marginBottom: 24 },
            ]}
          >
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteButtonContainer}
                  onPress={() => {
                    handleDelete(notification)
                    closeSwipeable()
                  }}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
              ref={swipeableRef}
              friction={1}
              leftThreshold={50}
            >
              <View style={[styles.notificationContainer]}>
                {HeaderComponent}
                <View style={styles.notificationBody}>
                  <View>{ImageComponent}</View>
                  <View style={styles.descriptionContainer}>
                    {BodyComponent}
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text
                        style={[globalStyles.bodyTextRegular, styles.updatedAt]}
                      >
                        {moment(notification.createdAt).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Swipeable>
          </GestureHandlerRootView>
        ) : (
          <View style={[styles.inAppNotificationContainer]}>
            <View style={styles.inAppNotificationBody}>
              {ImageComponent}
              <View style={styles.inAppDescriptionContainer}>
                {HeaderComponent}
                {BodyComponent}
              </View>
            </View>
          </View>
        )}
      </>
    )
  }
)

export default Notificationpage

const styles = StyleSheet.create({
  gestureContainer: {
    width: '100%',
  },
  notificationContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '94%',
    borderWidth: 1,
    borderColor: '#EAEBEC',
  },
  inAppNotificationContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
  },
  notificationBody: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  inAppNotificationBody: { flexDirection: 'row', gap: 16 },
  descriptionContainer: {
    flexShrink: 1,
    gap: 16,
    width: '100%',
  },
  inAppDescriptionContainer: { flexShrink: 1, gap: 4, width: '100%' },
  title: {
    fontSize: 16,
  },
  textColor: {
    color: '#375064',
  },
  updatedAt: {
    fontSize: 12,
    color: '#6D767C',
    lineHeight: 15,
  },
  lineSeparator: {
    borderBottomColor: '#EAEBEC',
    borderBottomWidth: 1,
  },
  personalHistoryInfo: { flexDirection: 'row', gap: 8 },
  initialContainer: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: '#EAEBEC',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  initialsAvatar: {
    color: 'black',
    fontSize: 16,
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEBEC',
    backgroundColor: '#FD5252',
    marginRight: 24,
  },
  deleteText: {
    color: '#FFF',
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
  },
})
