import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import globalStyles from '@/globalStyles'
import { CrossIcon, Ellipse } from '@/assets/icons/icon'
import IconContainer from './IconContainer'

export const InAppNotificationHeader = ({
  headerTitle,
  icon,
  updatedAt,
  handleRemoveNotification,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.iconWrapper}>
        <IconContainer icon={icon} iconStyle={{ width: 16, height: 16 }} />
        <Text style={[globalStyles.bodyTextBold, styles.headerTitle]}>
          {headerTitle}
        </Text>
        <Ellipse />
        <Text style={[globalStyles.bodyTextRegular, styles.updatedAt]}>
          {updatedAt}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          alignItems: 'flex-end',
        }}
        hitSlop={{ top: 15, bottom: 15, left: 50, right: 50 }}
        onPress={(e) => handleRemoveNotification(e)}
      >
        <CrossIcon />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: {
    fontSize: 12,
    color: '#4440D6',
  },
  iconWrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  updatedAt: {
    fontSize: 12,
    color: '#6D767C',
  },
})
