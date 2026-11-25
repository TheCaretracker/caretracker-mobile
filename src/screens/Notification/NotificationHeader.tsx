import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import globalStyles from '@/globalStyles'
import { CrossIcon, RedEllipse } from '@/assets/icons/icon'
import IconContainer from './IconContainer'

const NotificationHeader = ({
  headerTitle,
  icon,
  isUnread,
  openRightAction,
}: any) => {
  return (
    <View style={styles.notificationHeader}>
      <View style={styles.iconWrapper}>
        <IconContainer icon={icon} iconStyle={{ width: 16, height: 16 }} />
        <Text style={[globalStyles.bodyTextBold, styles.headerTitle]}>
          {headerTitle}
        </Text>
        {isUnread && <RedEllipse />}
      </View>
      <TouchableOpacity onPress={openRightAction}>
        <CrossIcon />
      </TouchableOpacity>
    </View>
  )
}

export default NotificationHeader

const styles = StyleSheet.create({
  notificationHeader: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#EAEBEC',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    width: '100%',
  },
  headerTitle: {
    fontSize: 12,
    color: '#4440D6',
  },
  iconWrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
})
